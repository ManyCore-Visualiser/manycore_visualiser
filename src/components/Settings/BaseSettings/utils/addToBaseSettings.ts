import { UseFieldArrayReturn } from "react-hook-form";
import { FieldT, FormValues } from "../..";
import {
  ConfigurableBaseConfigurationAttributeT,
  ConfigurableBaseConfigurationT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";

function addFontSize(
  name: string,
  entry: ConfigurableBaseConfigurationAttributeT
): FieldT {
  return {
    [name]: entry.default,
    attribute: name,
    display: entry.display,
    type: entry.type,
  };
}

export default function addToBaseSettings(
  baseConfiguration: ConfigurableBaseConfigurationT,
  array: UseFieldArrayReturn<FormValues, ConfigurationVariantsT>
) {
  const fields: FieldT[] = [];
  Object.entries(baseConfiguration).forEach(([attribute, entry]) => {
    switch (entry.type) {
      case "FontSize":
        fields.push(addFontSize(attribute, entry));
        break;
    }
  });

  array.replace(fields);
}
