import { UseFieldArrayReturn, UseFormSetValue } from "react-hook-form";
import { FieldT, FormValues } from "..";
import {
  ConfigurationVariantsT,
  DispatchFillOverrideGroupT,
  SerDeFillOverrideGroupT,
  WholeConfigurationT,
} from "../../../types/configuration";
import populateConfig from "../ElementSettings/utils/populateConfig";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import populateBaseConfig from "../BaseSettings/utils/populateBaseConfig";
import toast from "react-hot-toast";
import WarningRounded from "../../icons/WarningRounded";

export type ArrayT = UseFieldArrayReturn<FormValues, ConfigurationVariantsT>;

export function findIndex(
  array: FieldT[],
  variant: ConfigurationVariantsT,
  attribute: string
): { outcome: boolean; index: number } {
  const index = array.findIndex((field) => field.attribute === attribute);
  // I'd rather do the comparison twice than pasting the toast warning everywhere
  if (index === -1) {
    toast(
      <span>
        This system does not contain any attribute named{" "}
        <code>{attribute}</code> for{" "}
        <code>
          {variant.slice(
            0,
            variant === "SVG" ? variant.length : variant.length - 1
          )}
        </code>{" "}
        elements.
      </span>,
      {
        icon: (
          <WarningRounded width="2em" height="2em" className="text-amber-500" />
        ),
        duration: 5000,
      }
    );

    return { outcome: false, index };
  }

  return { outcome: true, index };
}

function populateMap(object: SerDeFillOverrideGroupT): Map<number, string> {
  return Object.entries(object).reduce((acc, [index, colour]) => {
    const idx = parseInt(index);

    if (!isNaN(idx)) {
      acc.set(idx, colour);
    }

    return acc;
  }, new Map<number, string>());
}

export default function populateFromConfiguration(
  wholeConfiguration: WholeConfigurationT,
  currentForm: FormValues,
  setValue: UseFormSetValue<FormValues>,
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>,
  dispatchCoreFills: React.Dispatch<DispatchFillOverrideGroupT>,
  dispatchRouterFills: React.Dispatch<DispatchFillOverrideGroupT>
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

  const coreFills = populateMap(wholeConfiguration.configuration.coreFills);
  const routerFills = populateMap(wholeConfiguration.configuration.routerFills);

  dispatchCoreFills({ type: "replace", map: coreFills });
  dispatchRouterFills({ type: "replace", map: routerFills });
}
