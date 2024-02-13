import { BaseResponseT } from "./baseResponse";

export type SVGT = string | null;

export interface SVGResponseT extends BaseResponseT {
  svg?: string;
}
