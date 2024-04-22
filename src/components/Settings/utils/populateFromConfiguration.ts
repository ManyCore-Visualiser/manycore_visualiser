import { UseFieldArrayReturn, UseFormSetValue } from "react-hook-form";
import { FieldT, FormValues } from "..";
import {
  ConfigurationVariantsT,
  WholeConfigurationT,
} from "../../../types/configuration";
import populateConfig from "../ElementSettings/utils/populateConfig";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import populateBaseConfig from "../BaseSettings/utils/populateBaseConfig";

export type ArrayT = UseFieldArrayReturn<FormValues, ConfigurationVariantsT>;

export function findIndex(array: FieldT[], attribute: string) {
  return array.findIndex((field) => field.attribute === attribute);
}

export default function populateFromConfiguration(
  wholeConfiguration: WholeConfigurationT,
  currentForm: FormValues,
  setValue: UseFormSetValue<FormValues>,
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>
) {
  populateBaseConfig(
    currentForm.SVG,
    "SVG",
    setValue,
    wholeConfiguration.baseConfiguration
  );

  populateConfig(
    currentForm.Cores,
    "Cores",
    setValue,
    wholeConfiguration.configuration.coreConfig,
    dispatchDisplayMap
  );

  populateConfig(
    currentForm.Routers,
    "Routers",
    setValue,
    wholeConfiguration.configuration.routerConfig,
    dispatchDisplayMap
  );

  populateConfig(
    currentForm.Channels,
    "Channels",
    setValue,
    wholeConfiguration.configuration.channelConfig,
    dispatchDisplayMap
  );
}
