import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { useAppContext } from "../../App";
import { Point } from "../../types/freeForm";
import { ClipPathInput } from "../../types/svg";
import { cleanUpPanZoom, registerPanZoom } from "../../utils/svgPanZoom";
import ControlButton from "./ControlButton";
import RoundBorderOuter from "../icons/RoundBorderOuter";
import TwotoneCameraEnhance from "../icons/TwotoneCameraEnhance";
import TwotoneSettings from "../icons/TwotoneSettings";
import { ModalContext } from "../Modal";
import PNGModal from "./PNGModal";

function convertPoint(point: Point, viewBox: DOMRect): [number, number] {
  const x = viewBox.width * (point.x / 100) + viewBox.x;
  const y = viewBox.height * (point.y / 100) + viewBox.y;

  return [x, y];
}

const Controls: React.FunctionComponent = () => {
  const ctx = useAppContext();

  const [displayModal, setDisplayModal] = useState<string | null>(null);
  const [svgSize, setSVGSize] = useState({ width: 0, height: 0 });
  const [clipPath, setClipPath] = useState<ClipPathInput | undefined>(
    undefined
  );
  const modalName = "PNGSize";

  const handleSettings = () => {
    ctx.showSettings(true);
  };

  const handleExport = (renderMode: "PNG" | "SVG") => {
    // This local clipPath variable shadows the const.
    // It's okay, we compute it and reset it each time in here.
    let clipPath: ClipPathInput | undefined = undefined;
    setClipPath(undefined);
    if (ctx.svgRef.current) {
      const viewBox = ctx.svgRef.current.viewBox.baseVal;
      setSVGSize({ width: viewBox.width, height: viewBox.height });

      if (ctx.freeFormPoints.length > 0) {
        let x = Number.MAX_SAFE_INTEGER;
        let y = Number.MAX_SAFE_INTEGER;
        let width = Number.MIN_SAFE_INTEGER;
        let height = Number.MIN_SAFE_INTEGER;
        const pathEntries: string[] = [];

        // Find view box
        for (let i = 0; i < ctx.freeFormPoints.length; i++) {
          const [px, py] = convertPoint(ctx.freeFormPoints[i], viewBox);
          pathEntries.push(`${px} ${py}`);

          if (px < x) {
            x = px;
          }

          if (px > width) {
            width = px;
          }

          if (py < y) {
            y = py;
          }

          if (py > height) {
            height = py;
          }
        }

        width -= x;
        height -= y;

        clipPath = {
          clipPath: pathEntries.join(", "),
          x: Math.ceil(x),
          y: Math.ceil(y),
          width: Math.floor(width),
          height: Math.floor(height),
        };

        setClipPath(clipPath);

        // Update SVG size to clipped one
        setSVGSize({
          width,
          height,
        });
      }
    }

    if (renderMode === "SVG") {
      // Will emit message to window
      // Note that this is using the block scoped clipPath
      invoke("export_render", { clipPath, renderMode, scale: 1 });
    } else {
      setDisplayModal(modalName);
    }
  };

  const handleFreeForm = () => {
    setExporting(false);

    ctx.setFreeForm((freeform) => {
      if (freeform) {
        if (ctx.graphParentRef.current)
          registerPanZoom(ctx.graphParentRef.current);

        // Clear points
        ctx.setFreeFormPoints([]);
      } else {
        if (ctx.graphParentRef.current)
          cleanUpPanZoom(ctx.graphParentRef.current);
      }

      return !freeform;
    });
  };

  const [exporting, setExporting] = useState(false);

  return (
    <ModalContext.Provider
      value={{ display: displayModal, setDisplay: setDisplayModal }}
    >
      <div className="fixed bottom-7 left-0 flex">
        <ControlButton
          Icon={TwotoneSettings}
          action={handleSettings}
          disabled={ctx.freeForm}
        />
        <ControlButton
          Icon={TwotoneCameraEnhance}
          action={() => setExporting((prev) => !prev)}
          disabled={ctx.freeForm && ctx.freeFormPoints.length < 3}
        >
          <div
            className={`flex flex-col absolute top-0 left-0 right-0 items-center transition-all duration-300 z-40 ${
              exporting
                ? "opacity-100 -translate-y-full"
                : "translate-y-3 opacity-0"
            }`}
          >
            <button
              className="bg-indigo-200 text-indigo-700 rounded-full px-4 py-1 font-bold text-base"
              disabled={!exporting}
              onClick={() => handleExport("SVG")}
            >
              SVG
            </button>
            <button
              className="bg-indigo-200 text-indigo-700 rounded-full px-4 py-1 font-bold text-base my-4"
              disabled={!exporting}
              onClick={() => handleExport("PNG")}
            >
              PNG
            </button>
          </div>
        </ControlButton>
        <ControlButton
          Icon={RoundBorderOuter}
          action={handleFreeForm}
          disabled={false}
        />
      </div>
      <PNGModal
        name={modalName}
        width={svgSize.width}
        height={svgSize.height}
        clipPath={clipPath}
      />
    </ModalContext.Provider>
  );
};

export default Controls;
