import { useEffect, useRef } from "react";
import { useAppContext } from "../App";
import { D3ZoomEvent, select, zoom } from "d3";

const Graph: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const graphParentRef = useRef<HTMLDivElement | null>(null);
  const exportingAidRef = useRef<SVGRectElement | null>(null);
  const parser = new DOMParser();

  // Render SVG when updated
  useEffect(() => {
    if (ctx.svg && graphParentRef.current) {
      const svgDocument = parser.parseFromString(ctx.svg, "image/svg+xml");
      if (svgDocument.documentElement) {
        // Clear current content
        graphParentRef.current.innerHTML = "";

        const svgElement = svgDocument.documentElement;
        graphParentRef.current.appendChild(svgElement);
        exportingAidRef.current = svgElement.querySelector("rect");
        const svg = select<SVGSVGElement, unknown>("svg");
        const graphRoot = svgElement.querySelector("g");

        if (svg && graphRoot) {
          svg.call(
            zoom<SVGSVGElement, unknown>().on(
              "zoom",
              (ev: D3ZoomEvent<SVGSVGElement, unknown>) => {
                graphRoot.setAttribute("transform", ev.transform.toString());
              }
            )
          );
        }
      } else {
        // TODO: Propagate error
      }
    }
  }, [ctx.svg, graphParentRef]);

  // Toggle Exporting aid
  useEffect(() => {
    if (exportingAidRef.current) {
      exportingAidRef.current.setAttribute(
        "opacity",
        ctx.aidOpacity ? "1" : "0"
      );
    }
  }, [ctx.aidOpacity]);

  return (
    <div
      className="py-1 w-full max-h-full aspect-square m-auto overflow-hidden block"
      ref={graphParentRef}
    ></div>
  );
};

export default Graph;
