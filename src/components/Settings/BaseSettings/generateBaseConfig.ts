import {
  BaseConfigurationItemT,
  BaseConfigurationT,
  ConfigurableBaseConfigurationT,
  ConfigurationVariantsT,
} from "../../../types/configuration";

function generateFontSize(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string,
  defaultVal: number
): number {
  const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

  // Ensure element is in DOM
  if (elem) {
    const value = parseInt(elem.value);

    if (!isNaN(value)) {
      return value;
    }
  }

  return defaultVal;
}

export default function generateBaseConfig(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  configurableBaseConfiguration: ConfigurableBaseConfigurationT
): BaseConfigurationT {
  const config: BaseConfigurationT = {};

  Object.entries(configurableBaseConfiguration).forEach(([key, { type }]) => {
    let attrConf: BaseConfigurationItemT | undefined = undefined;

    if (type === "FontSize")
      attrConf = generateFontSize(
        form,
        variant,
        key,
        configurableBaseConfiguration[key].default
      );

    if (attrConf) config[key] = attrConf;
  });

  return config;
}
