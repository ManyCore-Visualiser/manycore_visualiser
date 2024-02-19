import React, { useEffect, useState } from "react";
import { ProcessedAttributesGroupT } from "../../types/configuration";
import Input from "./Input";

type ElementSettings = {
  attributes: ProcessedAttributesGroupT;
  mref: React.RefObject<HTMLFormElement>;
  setConfig: any;
  variant: "Cores" | "Routers";
};

const ElementSettings: React.FunctionComponent<ElementSettings> = ({
  attributes,
  mref,
  setConfig,
  variant,
}) => {
  let config: any = {};
  const [orderedAttributes, setOrderedAttributes] = useState<string[]>([]);

  useEffect(() => {
    setOrderedAttributes(Object.keys(attributes).sort());
  }, [attributes]);

  const generateConfig: React.FormEventHandler<HTMLFormElement> = (ev) => {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    config = {};

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
              attributes[attribute].display,
              colourConf,
            ];
          }
        } else {
          attrConf["Text"] = attributes[attribute].display;
        }

        config[attribute] = attrConf;
      }
    }

    setConfig(config);
  };

  return (
    <div className="flex flex-col mt-10 px-2">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} information</h4>
      </span>
      <form className="mt-2" onSubmit={generateConfig} ref={mref}>
        {orderedAttributes.map((key) => {
          return (
            <div key={key}>
              <Input attribute={key} info={attributes[key]} variant={variant} />
            </div>
          );
        })}
      </form>
    </div>
  );
};

export default ElementSettings;
