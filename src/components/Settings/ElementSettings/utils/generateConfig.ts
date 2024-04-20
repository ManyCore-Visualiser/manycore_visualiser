import { FieldT } from "../..";
import {
  ColourConfig,
  ConfigurationVariantsT,
  ItemArgumentConfigurationT,
  ItemConfigurationT,
  ProcessedAttributesGroupT,
} from "../../../../types/configuration";
import { DisplayMapT } from "../../../../types/displayMap";

function generateText(
  field: FieldT,
  displayMap: DisplayMapT,
  display: string,
  variant: ConfigurationVariantsT
): ItemArgumentConfigurationT | undefined {
  if (field[field.attribute]) {
    return {
      type: "Text",
      display: displayMap[`${variant}-${field.attribute}`] ?? display,
    };
  }

  return undefined;
}

function generateColours(field: FieldT, key?: string): ColourConfig {
  if (!key) {
    key = field.attribute;
  }

  const colourConf: ColourConfig = {
    bounds: [0, 0, 0, 0],
    colours: ["#000", "#000", "#000", "#000"],
  };

  for (let i = 0; i < 4; i++) {
    const c = field[`${key}-${i}c`] as string;
    const v = field[`${key}-${i}v`] as number;

    colourConf.bounds[i] = v;
    colourConf.colours[i] = c;
  }

  return colourConf;
}

function generateNumber(
  field: FieldT,
  displayMap: DisplayMapT,
  display: string,
  variant: ConfigurationVariantsT
): ItemArgumentConfigurationT | undefined {
  if (field[field.attribute]) {
    const select = field[`${field.attribute}-select`];

    if (select == "Text") {
      return generateText(field, displayMap, display, variant);
    } else {
      const colourConf = generateColours(field);
      if (select == "Fill") {
        return { type: "Fill", ...colourConf };
      } else {
        return {
          type: "ColouredText",
          display: displayMap[`${variant}-${field.attribute}`] ?? display,
          ...colourConf,
        };
      }
    }
  }

  return undefined;
}

function generateBoolean(
  field: FieldT
): ItemArgumentConfigurationT | undefined {
  return field[field.attribute] ? { type: "Boolean", value: true } : undefined;
}

function generateCoordinates(
  field: FieldT
): ItemArgumentConfigurationT | undefined {
  return field[field.attribute]
    ? {
        type: "Coordinates",
        orientation: field[`${field.attribute}-select`] as "T" | "B",
      }
    : undefined;
}

function generateRouting(
  field: FieldT,
  displayMap: DisplayMapT,
  display: string,
  variant: ConfigurationVariantsT
): ItemArgumentConfigurationT | undefined {
  const algorithmSelect = field[`${field.attribute}-algo-select`];

  const loadsKey = `${field.attribute}-load`;
  const loadsSelect = field[`${loadsKey}-select`];

  if (algorithmSelect !== "None") {
    const colourConf = generateColours(field, loadsKey);
    return {
      type: "Routing",
      algorithm: algorithmSelect as string,
      loadConfiguration: loadsSelect as "Percentage" | "Fraction",
      ...colourConf,
      display: displayMap[`${variant}-${field.attribute}`] ?? display,
    };
  }
  return undefined;
}

export default function generateElementConfig(
  attributes: ProcessedAttributesGroupT,
  fields: FieldT[],
  displayMap: DisplayMapT,
  variant: ConfigurationVariantsT
): ItemConfigurationT {
  const config: ItemConfigurationT = {};
  for (const field of fields) {
    let attrConf: ItemArgumentConfigurationT | undefined = undefined;
    const type = attributes[field.attribute].type;
    const display = attributes[field.attribute].display;

    if (type === "boolean") attrConf = generateBoolean(field);
    else if (type === "coordinates") attrConf = generateCoordinates(field);
    else if (type === "number")
      attrConf = generateNumber(field, displayMap, display, variant);
    else if (type === "routing")
      attrConf = generateRouting(field, displayMap, display, variant);
    else if (type === "text")
      attrConf = generateText(field, displayMap, display, variant);

    if (attrConf) config[field.attribute] = attrConf;
  }

  return config;
}
