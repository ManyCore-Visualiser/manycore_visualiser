import React from "react";
import type { SVGResponseT, SVGT } from "../types/svg";
import { invoke } from "@tauri-apps/api";

export default function getSVG(
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>
) {
  invoke<SVGResponseT>("get_svg").then((res) => {
    if (res.status === "ok") {
      setSVG(res.svg!);
    } else {
      // TODO: Propagate error
    }
  });
}
