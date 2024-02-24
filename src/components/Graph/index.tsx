import { useEffect, useRef } from "react";
import { useAppContext } from "../../App";
import {
  applyMatrix,
  cleanUpPanZoom,
  registerPanZoom,
} from "../../utils/svgPanZoom";
import "./style.css";

const Graph: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const graphParentRef = useRef<HTMLDivElement | null>(null);
  const exportingAidRef = useRef<SVGRectElement | null>(null);
  const parser = new DOMParser();

  // Render SVG when updated
  useEffect(() => {
    console.log("Re render svg");
    if (ctx.svg && graphParentRef.current) {
      const currentSVG = graphParentRef.current.querySelector("svg");
      if (currentSVG) {
        cleanUpPanZoom(currentSVG);
      }

      const svgDocument = parser.parseFromString(ctx.svg, "image/svg+xml");
      if (svgDocument.documentElement) {
        // Clear current content
        graphParentRef.current.innerHTML = "";

        const svgElement =
          svgDocument.documentElement as unknown as SVGSVGElement;
        graphParentRef.current.appendChild(svgElement);

        exportingAidRef.current = svgElement.querySelector("rect");

        registerPanZoom(svgElement);
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
      className="py-1 w-full max-h-full aspect-square m-auto block graph-parent"
      ref={graphParentRef}
    ></div>
  );
};

export default Graph;
