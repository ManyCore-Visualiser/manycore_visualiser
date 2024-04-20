import {
  BaseConfigurationT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import { nativeInputValueSetter } from "../../utils/nativeSetters";

export default function populateBaseConfig(
  form: HTMLFormElement,
  baseConfiguration: BaseConfigurationT,
  variant: ConfigurationVariantsT
) {
  Object.keys(baseConfiguration).forEach((attribute) => {
    const element = form[`${variant}-${attribute}`] as HTMLInputElement | null;

    // Ensure this version of the program supports this base attribute by checking
    // we have an element to configure it in the settings.
    if (element) {
      nativeInputValueSetter?.call(
        element,
        baseConfiguration[attribute].toString(10)
      );

      // Trigger side effects
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}
