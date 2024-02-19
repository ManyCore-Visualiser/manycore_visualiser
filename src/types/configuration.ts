import { BaseResponseT } from "./baseResponse";

type AttributeTypeT = "number" | "text";

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
};

export type AttributesGroupT = {
  [key: string]: AttributeTypeT;
};

export interface AttributesResponseT extends BaseResponseT {
  attributes?: {
    core: AttributesGroupT;
    router: AttributesGroupT;
  };
}
