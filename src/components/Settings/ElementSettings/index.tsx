import React from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import { FormValues } from "..";
import {
  AttributeTypeT,
  ConfigurationVariantsT,
} from "../../../types/configuration";
import FillOverrides from "./FillOverrides";
import Input from "./Input";

type ElementSettingsT = {
  variant: ConfigurationVariantsT;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  fieldsArray: UseFieldArrayReturn<FormValues, ConfigurationVariantsT>;
};

const ElementSettings: React.FunctionComponent<ElementSettingsT> = ({
  variant,
  fillSelected,
  setFillSelected,
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
          fillSelected={fillSelected}
          setFillSelected={setFillSelected}
          key={field.id}
          index={index}
        />
      ))}
      {variant !== "Channels" && variant !== "SVG" && (
        <FillOverrides variant={variant} />
      )}
    </div>
  );
};

export default ElementSettings;
