import toast from "react-hot-toast";
import { FormValues } from "..";
import {
  ConfigurableBaseConfigurationT,
  FillOverrideGroupT,
  WholeConfigurationT,
} from "../../../types/configuration";
import { DisplayMapT } from "../../../types/displayMap";
import generateBaseConfig from "../BaseSettings/utils/generateBaseConfig";
import generateElementConfig from "../ElementSettings/utils/generateConfig";

function sanitiseConfiguration(
  configuration: WholeConfigurationT
): WholeConfigurationT | null {
  if (
    Object.keys(configuration.configuration.channelConfig).filter(
      (key) => key != "@borderRouters"
    ).length > 2
  ) {
    toast.error(
      "You can only select two channel attributes on top of displaying border routers.",
      { duration: 10000 }
    );

    return null;
  }

  return configuration;
}

export default function generateConfiguration(
  data: FormValues,
  displayMap: DisplayMapT,
  configurableBaseConfiguration: ConfigurableBaseConfigurationT,
  coreFills: FillOverrideGroupT,
  routerFills: FillOverrideGroupT
): WholeConfigurationT | null {
  const baseConfiguration = generateBaseConfig(
    data.SVG,
    configurableBaseConfiguration
  );

  const coreConfig = generateElementConfig(data.Cores, displayMap, "Cores");

  const routerConfig = generateElementConfig(
    data.Routers,
    displayMap,
    "Routers"
  );

  const channelConfig = generateElementConfig(
    data.Channels,
    displayMap,
    "Channels"
  );

  return sanitiseConfiguration({
    baseConfiguration,
    configuration: {
      coreConfig,
      routerConfig,
      channelConfig,
      coreFills: Object.fromEntries(coreFills.entries()),
      routerFills: Object.fromEntries(routerFills.entries()),
    },
  });
}
