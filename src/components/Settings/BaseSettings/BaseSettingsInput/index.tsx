import { UseFormRegister } from "react-hook-form";
import { FormValues } from "../..";
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
  register: UseFormRegister<FormValues>;
};

const BaseSettingsInput: React.FunctionComponent<BaseSettingsInputProps> = ({
  attribute,
  variant,
  specifics,
  index,
  register,
}) => {
  switch (specifics.type) {
    case "FontSize":
      return (
        <FontSizeInput
          attribute={attribute}
          variant={variant}
          specifics={specifics}
          index={index}
          register={register}
        />
      );
  }

  return <></>;
};

export default BaseSettingsInput;
