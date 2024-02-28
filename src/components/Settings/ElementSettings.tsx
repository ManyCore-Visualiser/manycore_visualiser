import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  CoreRouterConfiguration,
  ProcessedAttributesGroupT,
} from "../../types/configuration";
import { DisplayMapDispatchActionT, DisplayMapT } from "../../types/displayMap";
import Input from "./Input";

type ElementSettingsT = {
  attributes: ProcessedAttributesGroupT;
  promiseRef: React.MutableRefObject<
    (() => Promise<CoreRouterConfiguration>) | undefined
  >;
  variant: "Cores" | "Routers";
};

const ElementSettings: React.FunctionComponent<ElementSettingsT> = ({
  attributes,
  promiseRef,
  variant,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [orderedAttributes, setOrderedAttributes] = useState<string[]>([]);

  const displayReducer: React.Reducer<
    DisplayMapT,
    DisplayMapDispatchActionT
  > = (state, action) => {
    return { ...state, [action.attribute]: action.display };
  };
  const [displayMap, dispatchDisplayMap] = useReducer(displayReducer, {});

  useEffect(() => {
    setOrderedAttributes(Object.keys(attributes).sort());
  }, [attributes]);

  const generateConfig = (): CoreRouterConfiguration | null => {
    if (formRef.current) {
      const form = formRef.current;
      const config: CoreRouterConfiguration = {};

      for (const attribute of orderedAttributes) {
        const elem = form[attribute] as HTMLInputElement | undefined;
        if (elem && elem.checked) {
          const attrConf: any = {};
          const select = form[`${attribute}-select`] as
            | HTMLSelectElement
            | undefined;
          if (
            attributes[attribute].type === "number" &&
            select &&
            select.value !== "Text"
          ) {
            let colourConf: any = { bounds: [], colours: [] };

            for (let i = 0; i < 4; i++) {
              const c = form[`${attribute}-${i}c`].value;
              const v = form[`${attribute}-${i}v`].value;

              colourConf.bounds.push(parseInt(v));
              colourConf.colours.push(c);
            }

            if (select.value === "Fill") {
              attrConf["Fill"] = colourConf;
            } else {
              attrConf["ColouredText"] = [
                displayMap[attribute] ?? attributes[attribute].display,
                colourConf,
              ];
            }
          } else {
            if (attribute === "@coordinates") {
              const coordinatesSelect = form["@coordinates-select"] as
                | HTMLInputElement
                | undefined;
              if (coordinatesSelect) {
                attrConf["Text"] = coordinatesSelect.value;
              } else {
                attrConf["Text"] = "T";
              }
            } else {
              attrConf["Text"] =
                displayMap[attribute] ?? attributes[attribute].display;
            }
          }

          config[attribute] = attrConf;
        }
      }

      return config;
    }

    return null;
  };

  const generatePromise = () =>
    new Promise<CoreRouterConfiguration>((resolve, reject) => {
      const ret = generateConfig();

      if (ret) {
        resolve(ret);
      } else {
        reject("Something went wrong extracting the input. Please try again.");
      }
    });

  useEffect(() => {
    promiseRef.current = generatePromise;
  }, [orderedAttributes, displayMap, formRef]);

  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} information</h4>
      </span>
      <form
        className="mt-2"
        onSubmit={(ev) => ev.preventDefault()}
        ref={formRef}
      >
        {orderedAttributes.map((key) => {
          return (
            <div key={key}>
              <Input
                attribute={key}
                info={attributes[key]}
                variant={variant}
                dispatchDisplayMap={dispatchDisplayMap}
              />
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default ElementSettings;
