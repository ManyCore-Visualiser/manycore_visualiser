import { FieldT } from "../..";
import {
  BaseConfigurationItemT,
  BaseConfigurationT,
  ConfigurableBaseConfigurationT,
} from "../../../../types/configuration";

function generateFontSize(field: FieldT, defaultVal: number): number {
  if (!isNaN(field[field.attribute] as number)) {
    return field[field.attribute] as number;
  }

  return defaultVal;
}

export default function generateBaseConfig(
  fields: FieldT[],
  configurableBaseConfiguration: ConfigurableBaseConfigurationT
): BaseConfigurationT {
  const config: BaseConfigurationT = {};

  for (const field of fields) {
    let attrConf: BaseConfigurationItemT | undefined = undefined;

    const type = configurableBaseConfiguration[field.attribute].type;

    switch (type) {
      case "FontSize":
        attrConf = generateFontSize(
          field,
          configurableBaseConfiguration[field.attribute].default
        );
        break;
    }

    config[field.attribute] = attrConf;
  }

  return config;
}
