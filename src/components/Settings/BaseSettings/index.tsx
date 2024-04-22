import { UseFieldArrayReturn } from "react-hook-form";
import { FormValues } from "..";
import {
  ConfigurableBaseConfigurationT,
  ConfigurationVariantsT,
} from "../../../types/configuration";
import BaseSettingsInput from "./BaseSettingsInput";

type BaseSettingsProps = {
  variant: ConfigurationVariantsT;
  configurableBaseConfiguration: ConfigurableBaseConfigurationT;
  fieldsArray: UseFieldArrayReturn<FormValues, ConfigurationVariantsT>;
};

const BaseSettings: React.FunctionComponent<BaseSettingsProps> = ({
  variant,
  configurableBaseConfiguration,
  fieldsArray,
}) => {
  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} Settings</h4>
      </span>
      <p className="text-zinc-300 font-normal text-justify py-2">
        Note: Changing any of these settings will cause a full {variant} reload.
      </p>
      {fieldsArray.fields.map((field, index) => (
        <BaseSettingsInput
          key={field.id}
          attribute={field.attribute}
          variant={variant}
          specifics={configurableBaseConfiguration[field.attribute]}
          index={index}
        />
      ))}
    </div>
  );
};

export default BaseSettings;
