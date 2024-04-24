import { UseFormSetValue } from "react-hook-form";
import { FieldT, FormValues } from "../..";
import {
  BaseConfigurationT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import { findIndex } from "../../utils/populateFromConfiguration";

export default function populateBaseConfig(
  array: FieldT[],
  variant: ConfigurationVariantsT,
  setValue: UseFormSetValue<FormValues>,
  baseConfiguration: BaseConfigurationT
) {
  Object.entries(baseConfiguration).forEach(([attribute, entry]) => {
    // We only support FontSize for now
    const { outcome, index } = findIndex(array, variant, attribute);
    if (outcome) {
      setValue(`${variant}.${index}.${attribute}`, entry, {
        shouldDirty: true,
      });
    }
  });
}
