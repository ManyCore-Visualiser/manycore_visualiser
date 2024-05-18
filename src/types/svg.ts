import { BaseResponseT } from "./baseResponse";

type SVGObject = { content: string; timestamp: string };

export type SVGUpdateT = SVGObject | null;
export type SVGT = SVGObject | null;

export interface SVGResponseT extends BaseResponseT {
  svg?: SVGObject;
}

export interface SVGUpdateResponseT extends BaseResponseT {
  update?: {
    style: string;
    informationGroup: string;
    tasksGroup: string;
    viewBox: string;
    svg?: string;
  };
}

export interface SVGRenderResponseT extends BaseResponseT { }

export interface InfoResponseT extends BaseResponseT {
  info?: Object;
}

export type ClipPathInput = {
  clipPath: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
