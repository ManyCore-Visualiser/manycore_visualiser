import {
  ColourConfig,
  ConfigurationVariantsT,
  CoordinatesHTMLSelectElement,
  ItemArgumentConfiguration,
  ItemConfiguration,
  LoadHTMLSelectElement,
  ProcessedAttributesGroupT,
} from "../../../types/configuration";
import { DisplayMapT } from "../../../types/displayMap";

function generateText(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string,
  display: string,
  displayMap: DisplayMapT
): ItemArgumentConfiguration | undefined {
  const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

  // Ensure element is in DOM and is checked
  if (elem && elem.checked) {
    return { Text: displayMap[`${variant}-${key}`] ?? display };
  }

  return undefined;
}

function generateColours(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string
): ColourConfig {
  const colourConf: ColourConfig = {
    bounds: [0, 0, 0, 0],
    colours: ["#000", "#000", "#000", "#000"],
  };

  for (let i = 0; i < 4; i++) {
    const c = form[`${variant}-${key}-${i}c`].value;
    const v = form[`${variant}-${key}-${i}v`].value;

    colourConf.bounds[i] = parseInt(v);
    colourConf.colours[i] = c;
  }

  return colourConf;
}

function generateNumber(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string,
  display: string,
  displayMap: DisplayMapT
): ItemArgumentConfiguration | undefined {
  const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

  // Ensure element is in DOM and is checked
  if (elem && elem.checked) {
    const select = form[`${variant}-${key}-select`] as
      | HTMLSelectElement
      | undefined;

    if (select) {
      if (select.value === "Text") {
        return generateText(form, variant, key, display, displayMap);
      }

      let attrConf: ItemArgumentConfiguration;
      const colourConf = generateColours(form, variant, key);

      if (select.value === "Fill") {
        attrConf = { Fill: colourConf };
      } else {
        attrConf = {
          ColouredText: [
            displayMap[`${variant}-${key}`] ?? display,
            colourConf,
          ],
        };
      }

      return attrConf;
    }
  }

  return undefined;
}

function generateBoolean(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string
): ItemArgumentConfiguration | undefined {
  const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

  // Ensure element is in DOM and is checked
  if (elem && elem.checked) {
    return { Boolean: true };
  }

  return undefined;
}

function generateCoordinates(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string
): ItemArgumentConfiguration | undefined {
  const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

  // Ensure element is in DOM and is checked
  if (elem && elem.checked) {
    const select = form[`${variant}-${key}-select`] as
      | CoordinatesHTMLSelectElement
      | undefined;

    if (select) {
      return { Coordinates: select.value };
    }
  }

  return undefined;
}

function generateRouting(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  key: string
): ItemArgumentConfiguration | undefined {
  const algorithmSelect = form[`${variant}-${key}-algo-select`] as
    | HTMLSelectElement
    | undefined;

  const loadsKey = `${key}-load`;
  const loadsSelect = form[`${variant}-${loadsKey}-select`] as
    | LoadHTMLSelectElement
    | undefined;

  // Ensure elements are in DOM with valid value
  if (algorithmSelect && algorithmSelect.value !== "None" && loadsSelect) {
    return {
      Routing: {
        algorithm: algorithmSelect.value,
        loadConfiguration: loadsSelect.value,
        loadColours: generateColours(form, variant, loadsKey),
      },
    };
  }
  return undefined;
}

export default function generateConfig(
  form: HTMLFormElement,
  variant: ConfigurationVariantsT,
  attributes: ProcessedAttributesGroupT,
  displayMap: DisplayMapT
): ItemConfiguration {
  const config: ItemConfiguration = {};

  Object.entries(attributes).forEach(([key, { type, display }]) => {
    let attrConf: ItemArgumentConfiguration | undefined = undefined;

    if (type === "boolean") attrConf = generateBoolean(form, variant, key);
    else if (type === "coordinates")
      attrConf = generateCoordinates(form, variant, key);
    else if (type === "number")
      attrConf = generateNumber(form, variant, key, display, displayMap);
    else if (type === "routing") attrConf = generateRouting(form, variant, key);
    else if (type === "text")
      attrConf = generateText(form, variant, key, display, displayMap);

    if (attrConf) config[key] = attrConf;
  });

  return config;
}
