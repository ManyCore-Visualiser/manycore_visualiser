import { invoke } from "@tauri-apps/api";
import { useAppContext } from "../App";
import ControlButton from "./ControlButton";
import RoundBorderOuter from "./icons/RoundBorderOuter";
import TwotoneCameraEnhance from "./icons/TwotoneCameraEnhance";
import TwotoneSettings from "./icons/TwotoneSettings";
import { ClipPathInput, SVGRenderResponseT } from "../types/svg";
import { cleanUpPanZoom, registerPanZoom } from "../utils/svgPanZoom";
import { Point } from "../types/freeForm";

function convertPoint(point: Point, viewBox: DOMRect): [number, number] {
  const x = viewBox.width * (point.x / 100) + viewBox.x;
  const y = viewBox.height * (point.y / 100) + viewBox.y;

  return [x, y];
}

const Controls: React.FunctionComponent = () => {
  const ctx = useAppContext();

  const handleSettings = () => {
    ctx.showSettings(true);
  };

  const handleExport = () => {
    let clipPath: ClipPathInput | undefined = undefined;
    if (ctx.freeFormPoints.length > 0 && ctx.svgRef.current) {
      let x = Number.MAX_SAFE_INTEGER;
      let y = Number.MAX_SAFE_INTEGER;
      let width = Number.MIN_SAFE_INTEGER;
      let height = Number.MIN_SAFE_INTEGER;
      const pathEntries: string[] = [];
      const viewBox = ctx.svgRef.current.viewBox.baseVal;

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
    }

    invoke<SVGRenderResponseT>("render_svg", { clipPath }).then((res) => {
      if (res.status === "error") {
        // TODO: Handle error
        console.log(res.message);
      }
    });
  };

  const handleFreeForm = () => {
    ctx.setFreeForm((freeform) => {
      if (freeform) {
        if (ctx.svgRef.current) registerPanZoom(ctx.svgRef.current);

        // Clear points
        ctx.setFreeFormPoints([]);
      } else {
        if (ctx.svgRef.current) cleanUpPanZoom(ctx.svgRef.current);
      }

      return !freeform;
    });
  };

  return (
    <div className="fixed bottom-7 left-0">
      <ControlButton
        Icon={TwotoneSettings}
        action={handleSettings}
        disabled={ctx.freeForm}
      />
      <ControlButton
        Icon={TwotoneCameraEnhance}
        action={handleExport}
        disabled={ctx.freeForm && ctx.freeFormPoints.length < 3}
      />
      <ControlButton
        Icon={RoundBorderOuter}
        action={handleFreeForm}
        disabled={false}
      />
    </div>
  );
};

export default Controls;
