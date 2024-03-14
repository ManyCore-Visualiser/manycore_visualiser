import { useCallback, useEffect, useRef, useState } from "react";
import {
  ELEMENT_INFO_DESTROY_EVENT,
  ELEMENT_INFO_EVENT,
  HoveringInfoT,
} from "./Graph/hovering";

export const HOVER_INFO_ID = "hoverInfo";

function adjustCoordinates(
  element: HTMLDivElement,
  x: number,
  y: number
): { x: number; y: number } {
  const width = element.clientWidth;
  const height = element.clientHeight;

  const ret = { x, y };

  if (ret.x + width > window.innerWidth) {
    ret.x -= width;
  }

  if (ret.y + height > window.innerHeight) {
    ret.y -= height;
  }

  return ret;
}

const HoverInfo: React.FunctionComponent = () => {
  const [info, setInfo] = useState<Object>();
  const hoverContainerRef = useRef<HTMLDivElement>(null);

  const infoHandler = useCallback(
    ((ev: CustomEvent<HoveringInfoT>) => {
      setInfo(ev.detail.info);

      if (hoverContainerRef.current) {
        const { x, y } = adjustCoordinates(
          hoverContainerRef.current,
          ev.detail.x,
          ev.detail.y
        );
        hoverContainerRef.current.style.top = `${y}px`;
        hoverContainerRef.current.style.left = `${x}px`;
      }
    }) as EventListener,
    []
  );

  const destroyHandler = useCallback(() => {
    setInfo(undefined);
  }, []);

  const mouseHandler = useCallback(
    (ev: MouseEvent) => {
      if (hoverContainerRef.current) {
        const { x, y } = adjustCoordinates(
          hoverContainerRef.current,
          ev.clientX,
          ev.clientY
        );
        hoverContainerRef.current.style.top = `${y}px`;
        hoverContainerRef.current.style.left = `${x}px`;
      }
    },
    [hoverContainerRef]
  );

  // Initialise events
  useEffect(() => {
    if (hoverContainerRef.current) {
      hoverContainerRef.current.addEventListener(
        ELEMENT_INFO_EVENT,
        infoHandler
      );

      hoverContainerRef.current.addEventListener(
        ELEMENT_INFO_DESTROY_EVENT,
        destroyHandler
      );

      document.dispatchEvent(new CustomEvent(ELEMENT_INFO_EVENT));
    }

    return () => {
      if (hoverContainerRef.current) {
        hoverContainerRef.current.removeEventListener(
          ELEMENT_INFO_EVENT,
          infoHandler
        );

        hoverContainerRef.current.removeEventListener(
          ELEMENT_INFO_DESTROY_EVENT,
          destroyHandler
        );
      }
    };
  }, [hoverContainerRef]);

  // Track mouse if data is being displayed
  useEffect(() => {
    if (info && hoverContainerRef.current) {
      document.addEventListener("mousemove", mouseHandler);
    }

    return () => {
      document.removeEventListener("mousemove", mouseHandler);
    };
  }, [info, hoverContainerRef]);

  return (
    <div
      id={HOVER_INFO_ID}
      ref={hoverContainerRef}
      className="absolute z-50 top-0 left-0 pointer-events-none rounded-lg shadow-sm"
    >
      {info && (
        <table className="w-full text-left rounded-lg border-separate border-indigo-950 border-3 border-spacing-0">
          <thead className="text-white uppercase">
            <tr className="bg-indigo-700">
              <th className="px-4 py-2 rounded-tl-[0.25rem]">Attribute</th>
              <th className="px-4 py-2 rounded-tr-[0.25rem]">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(info).map(([key, value]) => (
              <tr
                key={key}
                className="odd:bg-indigo-50 even:bg-indigo-100 [&>td:first-child]:last:rounded-bl-[0.25rem] [&>td:last-child]:last:rounded-br-[0.25rem]"
              >
                <td className="px-4 py-2">{key}</td>
                <td className="px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HoverInfo;
