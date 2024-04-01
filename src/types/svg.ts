import { BaseResponseT } from "./baseResponse";

type SVGObject = { content: string; timestamp: string };

export type SVGUpdateT = string | null;
export type SVGT = SVGObject | null;

export interface SVGResponseT extends BaseResponseT {
  svg?: SVGObject;
}

export interface SVGUpdateResponseT extends BaseResponseT {
  update?: {
    style: string;
    informationGroup: string;
    viewBox: string;
  };
}

export interface SVGRenderResponseT extends BaseResponseT {}

export interface InfoResponseT extends BaseResponseT {
  info?: Object;
}
