import { useEffect, useRef } from "react";
import { useAppContext } from "../../App";
import {
  cleanUpPanZoom,
  registerPanZoom,
  updateRatios,
} from "../../utils/svgPanZoom";
import "./style.css";
import { registerHoveringEvents } from "./hovering";
import FreeForm from "./FreeForm";

const Graph: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const graphParentRef = useRef<HTMLDivElement | null>(null);
  const parser = new DOMParser();

  // Render SVG when updated
  useEffect(() => {
    if (ctx.svg && graphParentRef.current) {
      const currentSVG = graphParentRef.current.querySelector("svg");
      if (currentSVG) {
        cleanUpPanZoom(currentSVG);
      }

      const svgDocument = parser.parseFromString(
        ctx.svg.content,
        "image/svg+xml"
      );
      if (svgDocument.documentElement) {
        // Clear current content
        graphParentRef.current.innerHTML = "";

        const svgElement =
          svgDocument.documentElement as unknown as SVGSVGElement;
        graphParentRef.current.appendChild(svgElement);

        ctx.svgRef.current = svgElement;

        const processingGroup = svgElement.getElementById(
          "processingGroup"
        ) as SVGGElement | null;

        registerHoveringEvents(processingGroup);

        registerPanZoom(svgElement);
      } else {
        // TODO: Propagate error
      }
    }
  }, [ctx.svg]);

  // Update SVG style when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current && ctx.svgStyle) {
      const currentStyle = ctx.svgRef.current.querySelector("style");
      if (currentStyle) {
        currentStyle.innerHTML = ctx.svgStyle;
      }
    }
  }, [ctx.svgStyle]);

  // Update SVG information group when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current) {
      const currentInformation =
        ctx.svgRef.current.getElementById("information");
      if (currentInformation) {
        currentInformation.innerHTML = ctx.svgInformation ?? "";
      }
    }
  }, [ctx.svgInformation]);

  // Update SVG viewBox when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current && ctx.svgViewbox) {
      ctx.svgRef.current.setAttribute("viewBox", ctx.svgViewbox);

      updateRatios(ctx.svgRef.current);
    }
  }, [ctx.svgViewbox]);

  return (
    <div
      className="py-1 w-full max-h-full aspect-square m-auto block graph-parent overflow-hidden"
      ref={graphParentRef}
    >
      {ctx.freeForm && <FreeForm svgRef={ctx.svgRef} />}
    </div>
  );
};

export default Graph;
