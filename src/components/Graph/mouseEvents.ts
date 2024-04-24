import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import { InfoResponseT } from "../../types/svg";
import { HOVER_INFO_ID } from "../HoverInfo";

export const ELEMENT_INFO_EVENT = "elementinfo";
export const ELEMENT_INFO_DESTROY_EVENT = "elementdestroy";
export type HoveringInfoT = {
  info: Object;
  x: number;
  y: number;
};
export const ELEMENT_FILL_EVENT = "elementfill";

function handleMouseEnter(ev: MouseEvent) {
  if (ev.target instanceof Element) {
    const groupId = ev.target.id;

    invoke<InfoResponseT>("get_info", { groupId }).then((res) => {
      if (res.status === "ok") {
        if (res.info) {
          const event = new CustomEvent<HoveringInfoT>(ELEMENT_INFO_EVENT, {
            bubbles: true,
            detail: {
              x: ev.clientX,
              y: ev.clientY,
              info: res.info,
            },
          });

          const target = document.getElementById(HOVER_INFO_ID);
          if (target) target.dispatchEvent(event);
        }
      } else {
        toast.error(res.message, { duration: 10000 });
      }
    });
  }
}

function handleMouseLeave(_: MouseEvent) {
  const event = new CustomEvent(ELEMENT_INFO_DESTROY_EVENT, { bubbles: true });

  const target = document.getElementById(HOVER_INFO_ID);
  if (target) target.dispatchEvent(event);
}

function handleRightClick(ev: MouseEvent) {
  if (ev.target instanceof SVGPathElement) {
    ev.preventDefault();

    const event = new CustomEvent(ELEMENT_FILL_EVENT, {
      detail: ev.target.id,
      bubbles: true,
      cancelable: false,
    });
    ev.target.dispatchEvent(event);
  }
}

export function registerMouseEvents(processingGroup: SVGGElement | null) {
  if (processingGroup) {
    const paths = processingGroup.querySelectorAll<SVGPathElement>("g > path");

    paths.forEach((path) => {
      path.addEventListener("contextmenu", handleRightClick);
      path.addEventListener("mouseenter", handleMouseEnter);
      path.addEventListener("mouseleave", handleMouseLeave);
    });
  }
}
