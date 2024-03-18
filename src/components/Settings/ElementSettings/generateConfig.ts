import {
  CoreRouterConfiguration,
  ProcessedAttributesGroupT,
} from "../../../types/configuration";
import { DisplayMapT } from "../../../types/displayMap";

export default function generateConfig(
  form: HTMLFormElement,
  variant: "Cores" | "Routers",
  attributes: ProcessedAttributesGroupT,
  displayMap: DisplayMapT
): CoreRouterConfiguration {
  const config: CoreRouterConfiguration = {};

  Object.entries(attributes).forEach(([key, { type, display }]) => {
    const elem = form[`${variant}-${key}`] as HTMLInputElement | undefined;

    // Ensure element is in DOM and is checked
    if (elem && elem.checked) {
      const attrConf: any = {};

      const select = form[`${variant}-${key}-select`] as
        | HTMLSelectElement
        | undefined;

      // User has picked a colour option
      if (type === "number" && select && select.value !== "Text") {
        let colourConf: any = { bounds: [], colours: [] };

        for (let i = 0; i < 4; i++) {
          const c = form[`${variant}-${key}-${i}c`].value;
          const v = form[`${variant}-${key}-${i}v`].value;

          colourConf.bounds.push(parseInt(v));
          colourConf.colours.push(c);
        }

        if (select.value === "Fill") {
          attrConf["Fill"] = colourConf;
        } else {
          attrConf["ColouredText"] = [
            displayMap[`${variant}-${key}`] ?? display,
            colourConf,
          ];
        }
      } else {
        // Coordinates is in core config so we can hardcode
        if (key === "@coordinates" && variant === "Cores") {
          const coordinatesSelect = form["Cores-@coordinates-select"] as
            | HTMLInputElement
            | undefined;
          if (coordinatesSelect) {
            attrConf["Text"] = coordinatesSelect.value;
          } else {
            attrConf["Text"] = "T";
          }
        } else {
          attrConf["Text"] = displayMap[`${variant}-${key}`] ?? display;
        }
      }

      config[key] = attrConf;
    }
  });

  return config;
}
