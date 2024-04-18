import { BaseResponseT } from "./baseResponse";

export type ConfigurationVariantsT = "Cores" | "Routers" | "Channels" | "SVG";

type AttributeTypeT = "number" | "text" | "boolean" | "routing" | "coordinates";
export type AttributeVariantsT = "Text" | "ColouredText" | "Fill";

export type ProcessedAttributesGroupContentT = {
  display: string;
  type: AttributeTypeT;
};

export type ProcessedAttributesGroupT = {
  [key: string]: ProcessedAttributesGroupContentT;
};

export type ProcessedAttributesT = {
  core: ProcessedAttributesGroupT;
  router: ProcessedAttributesGroupT;
  channel: ProcessedAttributesGroupT;
  algorithms: string[];
  observedAlgorithm: string | undefined;
};

export interface AttributesResponseT extends BaseResponseT {
  attributes?: ProcessedAttributesT;
}

export type ColourConfig = {
  bounds: [number, number, number, number];
  colours: [string, string, string, string];
};

export type ItemConfigurationT = {
  [key: string]: ItemArgumentConfigurationT;
};

type CoordinatesValuesT = "T" | "B";
export interface CoordinatesHTMLSelectElement extends HTMLSelectElement {
  value: CoordinatesValuesT;
}
type LoadConfigurationT = "Percentage" | "Fraction";
export interface LoadHTMLSelectElement extends HTMLSelectElement {
  value: LoadConfigurationT;
}
export type ItemArgumentConfigurationT =
  | { Text: string }
  | { Fill: ColourConfig }
  | { ColouredText: [string, ColourConfig] }
  | { Boolean: true }
  | { Coordinates: CoordinatesValuesT }
  | {
      Routing: {
        algorithm: string;
        loadConfiguration: LoadConfigurationT;
        loadColours: ColourConfig;
        display: string;
      };
    };

export type ConfigurationT = {
  coreConfig: ItemConfigurationT;
  routerConfig: ItemConfigurationT;
  channelConfig: ItemConfigurationT;
};

export type ConfigurableBaseConfigurationAttributeT = {
  type: "FontSize";
  display: string;
  default: number;
  min: number;
  max: number;
};
export type ConfigurableBaseConfigurationT = {
  [key: string]: ConfigurableBaseConfigurationAttributeT;
};

export interface BaseConfigurationResponseT extends BaseResponseT {
  baseConfiguration: ConfigurableBaseConfigurationT;
}

export type BaseConfigurationItemT = number;

export type BaseConfigurationT = {
  [key: string]: BaseConfigurationItemT;
};
