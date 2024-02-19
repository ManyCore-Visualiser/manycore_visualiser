import { useAppContext } from "../App";
import ControlButton from "./ControlButton";
import RoundBorderOuter from "./icons/RoundBorderOuter";
import TwotoneCameraEnhance from "./icons/TwotoneCameraEnhance";
import TwotoneSettings from "./icons/TwotoneSettings";

const Controls: React.FunctionComponent = () => {
  const ctx = useAppContext();

  const handleSettings = () => {
    ctx.showSettings(true);
  };

  const handleExport = () => {};

  const handleAid = () => {
    ctx.setAidOpacity((curr) => !curr);
  };

  return (
    <div className="fixed bottom-7 left-0">
      <ControlButton Icon={TwotoneSettings} action={handleSettings} />
      <ControlButton Icon={TwotoneCameraEnhance} action={handleExport} />
      <ControlButton Icon={RoundBorderOuter} action={handleAid} />
    </div>
  );
};

export default Controls;
