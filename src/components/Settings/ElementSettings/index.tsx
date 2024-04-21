import React from "react";
import { UseFieldArrayReturn, UseFormRegister } from "react-hook-form";
import { FormValues } from "..";
import {
  AttributeTypeT,
  ConfigurationVariantsT,
} from "../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import Input from "./Input";

type ElementSettingsT = {
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  observedAlgorithm?: string | undefined;
  algorithms?: string[];
  register: UseFormRegister<FormValues>;
  fieldsArray: UseFieldArrayReturn<FormValues, ConfigurationVariantsT>;
};

const ElementSettings: React.FunctionComponent<ElementSettingsT> = ({
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
  algorithms,
  observedAlgorithm,
  register,
  fieldsArray,
}) => {
  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} information</h4>
      </span>
      {fieldsArray.fields.map((field, index) => (
        <Input
          attribute={field.attribute}
          type={field.type as AttributeTypeT}
          display={field.display}
          variant={variant}
          dispatchDisplayMap={dispatchDisplayMap}
          fillSelected={fillSelected}
          setFillSelected={setFillSelected}
          algorithms={algorithms}
          observedAlgorithm={observedAlgorithm}
          key={field.id}
          index={index}
          register={register}
        />
      ))}
    </div>
  );
};

export default ElementSettings;
