import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../App";
import {
  MatrixT,
  cleanUpPanZoom,
  registerPanZoom,
  resetMatrix,
  restoreMatrix,
} from "../../utils/svgPanZoom";
import { useModalContext } from "../Modal";
import FillModal from "./FillModal";
import FreeForm from "./FreeForm";
import { ELEMENT_FILL_EVENT, registerMouseEvents } from "./mouseEvents";
import "./style.css";

const Graph: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const parser = new DOMParser();
  const [oldMatrix, setOldMatrix] = useState<MatrixT | undefined>(undefined);
  const [fillElementId, setFillElementId] = useState("");
  const { setDisplay } = useModalContext();
  const modalName = "fill";

  // Render SVG when updated
  useEffect(() => {
    if (ctx.svg && ctx.graphParentRef.current) {
      cleanUpPanZoom(ctx.graphParentRef.current);

      const svgDocument = parser.parseFromString(
        ctx.svg.content,
        "image/svg+xml"
      );
      if (svgDocument.documentElement) {
        // Clear current content
        ctx.graphParentRef.current.innerHTML = "";

        const svgElement =
          svgDocument.documentElement as unknown as SVGSVGElement;
        ctx.graphParentRef.current.appendChild(svgElement);

        ctx.svgRef.current = svgElement;

        const processingGroup = svgElement.getElementById(
          "processingGroup"
        ) as SVGGElement | null;

        registerMouseEvents(processingGroup);

        registerPanZoom(ctx.graphParentRef.current);
      } else {
        toast.error("Could not initialise rendering process.", {
          duration: 10000,
        });
      }
    }
  }, [ctx.svg]);

  // Update SVG style when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current && ctx.svgStyle?.content) {
      const currentStyle = ctx.svgRef.current.querySelector("style");
      if (currentStyle) {
        currentStyle.innerHTML = ctx.svgStyle.content;
      }
    }
  }, [ctx.svgStyle]);

  // Update SVG information group when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current) {
      const currentInformation =
        ctx.svgRef.current.getElementById("information");
      if (currentInformation) {
        currentInformation.innerHTML = ctx.svgInformation?.content ?? "";
      }
    }
  }, [ctx.svgInformation]);

  // Update SVG tasks group when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current && ctx.svgTasks?.content) {
      const currentTasks =
        ctx.svgRef.current.getElementById("tasks");
      if (currentTasks) {
        currentTasks.innerHTML = ctx.svgTasks.content;
      }
    }
  }, [ctx.svgTasks]);

  // Update SVG viewBox when an update is dispatched
  useEffect(() => {
    if (ctx.svgRef.current && ctx.svgViewbox) {
      ctx.svgRef.current.setAttribute("viewBox", ctx.svgViewbox.content);
    }
  }, [ctx.svgViewbox]);

  // Move SVG when settings panel is open
  useEffect(() => {
    if (
      ctx.graphParentRef.current &&
      ctx.settingsRef.current &&
      ctx.svgRef.current
    ) {
      if (ctx.settings) {
        // If settings are open we want to reduce the size of the
        // graph parent to the available remaining window size.
        // We also resent the SVG matrix to maximise the visible svg part.
        // We add some padding to the parent to avoid the SVG border
        // overlapping with the window border.
        const settingsWidth = ctx.settingsRef.current.clientWidth;

        ctx.graphParentRef.current.classList.add("px-1");
        ctx.graphParentRef.current.classList.remove("w-full");
        ctx.graphParentRef.current.style.marginLeft = `${settingsWidth}px`;
        ctx.graphParentRef.current.style.width = `calc(100% - ${settingsWidth}px)`;

        ctx.svgRef.current.classList.add(
          "transition-transform",
          "duration-300"
        );
        setTimeout(() => {
          if (ctx.svgRef.current)
            ctx.svgRef.current.classList.remove(
              "transition-transform",
              "duration-300"
            );
        }, 500);

        setOldMatrix(resetMatrix(ctx.svgRef.current));
      } else {
        ctx.graphParentRef.current.style.marginLeft = "";
        ctx.graphParentRef.current.style.width = "";
        ctx.graphParentRef.current.classList.remove("px-1");
        ctx.graphParentRef.current.classList.add("w-full");

        if (oldMatrix) {
          ctx.svgRef.current.classList.add(
            "transition-transform",
            "duration-300"
          );
          setTimeout(() => {
            if (ctx.svgRef.current)
              ctx.svgRef.current.classList.remove(
                "transition-transform",
                "duration-300"
              );
          }, 500);

          restoreMatrix(oldMatrix, ctx.svgRef.current);
          setOldMatrix(undefined);
        }
      }
    }
  }, [ctx.settings]);

  function handleFillEvent(ev: CustomEvent) {
    ev.preventDefault();

    setFillElementId(ev.detail);
    setDisplay(modalName);
  }

  // Register fill event
  useEffect(() => {
    if (ctx.graphParentRef.current) {
      ctx.graphParentRef.current.addEventListener(
        ELEMENT_FILL_EVENT,
        handleFillEvent as EventListener
      );
    }

    return () => {
      if (ctx.graphParentRef.current) {
        ctx.graphParentRef.current.removeEventListener(
          ELEMENT_FILL_EVENT,
          handleFillEvent as EventListener
        );
      }
    };
  }, []);

  return (
    <>
      <div
        className="h-full w-full py-4 graph-parent transition-all duration-300"
        ref={ctx.graphParentRef}
      >
        {ctx.freeForm && <FreeForm svgRef={ctx.svgRef} />}
      </div>
      <FillModal name={modalName} elementId={fillElementId} />
    </>
  );
};

export default Graph;
