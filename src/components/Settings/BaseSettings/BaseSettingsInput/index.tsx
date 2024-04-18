import { ConfigurableBaseConfigurationAttributeT } from "../../../../types/configuration";
import FontSizeInput from "./FontSizeInput";

type BaseSettingsInputProps = {
  attribute: string;
  variant: string;
  specifics: ConfigurableBaseConfigurationAttributeT;
};

const BaseSettingsInput: React.FunctionComponent<BaseSettingsInputProps> = ({
  attribute,
  variant,
  specifics,
}) => {
  switch (specifics.type) {
    case "FontSize":
      return (
        <FontSizeInput attribute={attribute} variant={variant} specifics={specifics} />
      );
  }

  return <></>;
};

export default BaseSettingsInput;
