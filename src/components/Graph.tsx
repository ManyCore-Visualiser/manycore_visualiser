import { useEffect, useRef } from "react";
import { useAppContext } from "../App";

const Graph: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const graphParentRef = useRef<HTMLDivElement>(null);
  const parser = new DOMParser();

  useEffect(() => {
    if (ctx.svg && graphParentRef.current) {
      const svgDocument = parser.parseFromString(ctx.svg, "image/svg+xml");
      if (svgDocument.documentElement) {
        // Clear current content
        graphParentRef.current.innerHTML = "";

        graphParentRef.current.appendChild(svgDocument.documentElement);
      } else {
        // TODO: Propagate error
      }
    }
  }, [ctx.svg, graphParentRef]);

  return (
    <div
      className="w-1/2 max-h-full aspect-square m-auto overflow-hidden block"
      ref={graphParentRef}
    ></div>
  );
};

export default Graph;