import { ConfigurableBaseConfigurationT } from "../../../types/configuration";
import BaseSettingsInput from "./BaseSettingsInput";

type BaseSettingsProps = {
  variant: string;
  configurableBaseConfiguration: ConfigurableBaseConfigurationT;
};

const BaseSettings: React.FunctionComponent<BaseSettingsProps> = ({
  variant,
  configurableBaseConfiguration,
}) => {
  return (
    <div className="flex flex-col mt-10">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>{variant} Settings</h4>
      </span>
      <p className="text-zinc-300 font-normal text-justify py-2">
        Note: Changing any of these settings will cause a full {variant} reload.
      </p>
      {Object.keys(configurableBaseConfiguration).map((key) => (
        <BaseSettingsInput
          key={key}
          attribute={key}
          variant={variant}
          specifics={configurableBaseConfiguration[key]}
        />
      ))}
    </div>
  );
};

export default BaseSettings;
