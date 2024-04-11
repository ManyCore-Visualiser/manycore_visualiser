import React from "react";
import {
  ConfigurationVariantsT,
  ProcessedAttributesGroupT,
} from "../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import Input from "../Input";

type ElementSettingsT = {
  attributes: ProcessedAttributesGroupT;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  observedAlgorithm?: string | undefined;
  algorithms?: string[];
};

const ElementSettings: React.FunctionComponent<ElementSettingsT> = ({
  attributes,
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
  algorithms,
  observedAlgorithm,
}) => {
  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} information</h4>
      </span>
      {Object.keys(attributes).map((key) => {
        return (
          <Input
            attribute={key}
            info={attributes[key]}
            variant={variant}
            dispatchDisplayMap={dispatchDisplayMap}
            fillSelected={fillSelected}
            setFillSelected={setFillSelected}
            algorithms={algorithms}
            observedAlgorithm={observedAlgorithm}
            key={key}
          />
        );
      })}
    </div>
  );
};

export default ElementSettings;
