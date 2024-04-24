import { BaseResponseT } from "./baseResponse";

export type ConfigurationVariantsT = "Cores" | "Routers" | "Channels" | "SVG";

export type AttributeTypeT =
  | "number"
  | "text"
  | "boolean"
  | "routing"
  | "coordinates";
export type AttributeVariantsT = "Text" | "ColouredText" | "Fill";

export type ProcessedAttributesGroupContentT = {
  display: string;
  type: AttributeTypeT;
  new?: boolean;
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

export type TextArgumentT = { type: "Text"; display: string; colour?: string };
export type FillArgumentT = { type: "Fill" } & ColourConfig;
export type ColouredTextArgumentT = {
  type: "ColouredText";
  display: string;
} & ColourConfig;
export type BooleanArgumentT = { type: "Boolean"; value: boolean };
export type CoordinatesArgumentT = {
  type: "Coordinates";
  orientation: CoordinatesValuesT;
};
export type RoutingArgumentT = {
  type: "Routing";
  algorithm: string;
  loadConfiguration: LoadConfigurationT;
  display: string;
} & ColourConfig;

export type ItemArgumentConfigurationT =
  | TextArgumentT
  | FillArgumentT
  | ColouredTextArgumentT
  | BooleanArgumentT
  | CoordinatesArgumentT
  | RoutingArgumentT;

export type ConfigurationT = {
  coreConfig: ItemConfigurationT;
  routerConfig: ItemConfigurationT;
  channelConfig: ItemConfigurationT;
  coreFills: SerDeFillOverrideGroupT;
  routerFills: SerDeFillOverrideGroupT;
};

export type ConfigurableBaseConfigurationTypes = "FontSize";
export type ConfigurableBaseConfigurationAttributeT = {
  type: ConfigurableBaseConfigurationTypes;
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

export type WholeConfigurationT = {
  baseConfiguration: BaseConfigurationT;
  configuration: ConfigurationT;
};

export type FillOverrideGroupT = Map<number, string>;
export type SerDeFillOverrideGroupT = {
  [key: string]: string;
};
export type DispatchFillOverrideGroupT =
  | {
      type: "add";
      id: number;
      colour: string;
    }
  | { type: "remove"; id: number }
  | {
      type: "replace";
      map: Map<number, string>;
    };
