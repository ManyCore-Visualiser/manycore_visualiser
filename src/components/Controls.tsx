import { invoke } from "@tauri-apps/api";
import { useAppContext } from "../App";
import ControlButton from "./ControlButton";
import RoundBorderOuter from "./icons/RoundBorderOuter";
import TwotoneCameraEnhance from "./icons/TwotoneCameraEnhance";
import TwotoneSettings from "./icons/TwotoneSettings";
import { SVGRenderResponseT } from "../types/svg";

const Controls: React.FunctionComponent = () => {
  const ctx = useAppContext();

  const handleSettings = () => {
    ctx.showSettings(true);
  };

  const handleExport = () => {
    invoke<SVGRenderResponseT>("render_svg").then((res) => {
      if (res.status === "error") {
        // TODO: Handle error
        console.log(res.message);
      }
    });
  };

  // const handleAid = () => {
  //   ctx.setAidOpacity((curr) => !curr);
  // };
  const handleFreeForm = () => {
    ctx.setFreeForm(true);
  };

  return (
    <div className="fixed bottom-7 left-0">
      <ControlButton Icon={TwotoneSettings} action={handleSettings} />
      <ControlButton Icon={TwotoneCameraEnhance} action={handleExport} />
      <ControlButton Icon={RoundBorderOuter} action={handleFreeForm} />
    </div>
  );
};

export default Controls;
