import React, { useEffect, useState } from "react";
import { ProcessedAttributesGroupT } from "../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import Input from "../Input";

type ElementSettingsT = {
  attributes: ProcessedAttributesGroupT;
  variant: "Cores" | "Routers";
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
};

const ElementSettings: React.FunctionComponent<ElementSettingsT> = ({
  attributes,
  variant,
  dispatchDisplayMap
}) => {
  const [orderedAttributes, setOrderedAttributes] = useState<string[]>([]);

  useEffect(() => {
    setOrderedAttributes(Object.keys(attributes).sort());
  }, [attributes]);

  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} information</h4>
      </span>
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
    </div>
  );
};

export default ElementSettings;
