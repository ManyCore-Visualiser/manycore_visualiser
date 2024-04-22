import {
  ConfigurableBaseConfigurationAttributeT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import FontSizeInput from "./FontSizeInput";

type BaseSettingsInputProps = {
  attribute: string;
  variant: ConfigurationVariantsT;
  specifics: ConfigurableBaseConfigurationAttributeT;
  index: number;
};

const BaseSettingsInput: React.FunctionComponent<BaseSettingsInputProps> = ({
  attribute,
  variant,
  specifics,
  index,
}) => {
  switch (specifics.type) {
    case "FontSize":
      return (
        <FontSizeInput
          attribute={attribute}
          variant={variant}
          specifics={specifics}
          index={index}
        />
      );
  }

  return <></>;
};

export default BaseSettingsInput;
