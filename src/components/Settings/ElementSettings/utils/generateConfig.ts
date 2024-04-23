import { FieldT } from "../..";
import {
  ColourConfig,
  ConfigurationVariantsT,
  ItemArgumentConfigurationT,
  ItemConfigurationT,
} from "../../../../types/configuration";
import { DisplayMapT } from "../../../../types/displayMap";

function generateText(
  field: FieldT,
  displayMap: DisplayMapT,
  variant: ConfigurationVariantsT
): ItemArgumentConfigurationT | undefined {
  if (field[field.attribute]) {
    return {
      type: "Text",
      display: displayMap[`${variant}-${field.attribute}`] ?? field.display,
      colour: field[`${field.attribute}-colour`].toString(),
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
  variant: ConfigurationVariantsT
): ItemArgumentConfigurationT | undefined {
  if (field[field.attribute]) {
    const select = field[`${field.attribute}-select`];

    if (select == "Text") {
      return generateText(field, displayMap, variant);
    } else {
      const colourConf = generateColours(field);
      if (select == "Fill") {
        return { type: "Fill", ...colourConf };
      } else {
        return {
          type: "ColouredText",
          display: displayMap[`${variant}-${field.attribute}`] ?? field.display,
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
      display: displayMap[`${variant}-${field.attribute}`] ?? field.display,
    };
  }
  return undefined;
}

export default function generateElementConfig(
  fields: FieldT[],
  displayMap: DisplayMapT,
  variant: ConfigurationVariantsT
): ItemConfigurationT {
  const config: ItemConfigurationT = {};
  for (const field of fields) {
    let attrConf: ItemArgumentConfigurationT | undefined = undefined;

    if (field.type === "boolean") attrConf = generateBoolean(field);
    else if (field.type === "coordinates")
      attrConf = generateCoordinates(field);
    else if (field.type === "number")
      attrConf = generateNumber(field, displayMap, variant);
    else if (field.type === "routing")
      attrConf = generateRouting(field, displayMap, variant);
    else if (field.type === "text")
      attrConf = generateText(field, displayMap, variant);

    if (attrConf) config[field.attribute] = attrConf;
  }

  return config;
}
