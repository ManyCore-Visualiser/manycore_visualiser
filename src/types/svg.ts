import { BaseResponseT } from "./baseResponse";

export type SVGT = string | null;

export interface SVGResponseT extends BaseResponseT {
  svg?: string;
}

export interface SVGUpdateResponseT extends BaseResponseT {
  update?: {
    style?: string;
    informationGroup?: string;
    viewBox?: string;
    sinksSourcesGroup?: string;
  };
}

export interface SVGRenderResponseT extends BaseResponseT {}
