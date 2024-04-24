import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { ClipPathInput } from "../../../types/svg";
import Modal, { useModalContext } from "../../Modal";
import "../../Settings/number.css";
import toast from "react-hot-toast";

type FillModalProps = {
  name: string;
  width: number;
  height: number;
  clipPath?: ClipPathInput;
};

const PNGModal: React.FunctionComponent<FillModalProps> = ({
  name,
  width,
  height,
  clipPath,
}) => {
  const { setDisplay } = useModalContext();
  const [scale, setScale] = useState(1);
  const computedWidth = width * scale;
  const computedHeight = height * scale;
  const warning = computedWidth > 2000 || computedHeight > 2000;

  function closeModal() {
    setDisplay((prev) => (prev === name ? null : prev));
  }

  function handleExport() {
    // Will emit message to window
    invoke("export_render", { clipPath, renderMode: "PNG", scale }).catch((e) =>
      toast.error(e, { duration: 10000 })
    );

    closeModal();
  }

  return (
    <Modal name={name}>
      <div className="flex flex-col md:w-[50vw] lg:w-[40vw] xl:w-[30vw] 2xl:w-[22vw]">
        <h5 className="text-3xl text-indigo-500">PNG size</h5>
        <div className="grid grid-cols-2 grid-rows-2 text-lg gap-4 py-4 items-center text-center">
          <span className={warning ? "text-red-500" : ""}>
            Width: {Math.round(computedWidth)}px
          </span>
          <span className={warning ? "text-red-500" : ""}>
            Height: {Math.round(computedHeight)}px
          </span>
          <label htmlFor="scale">Scale factor:</label>
          <input
            id="PNGHeight"
            type="number"
            className="number w-20"
            defaultValue={scale}
            placeholder="0.1"
            onChange={(ev) => {
              const value = () => {
                const value = parseFloat(ev.target.value);

                if (isNaN(value)) {
                  return 0.1;
                }

                return value;
              };
              setScale(Math.max(value(), 0.1));
            }}
          ></input>
        </div>
        <div className="grid grid-cols-2 items-center">
          {warning && (
            <span className="text-red-500 text-justify">
              This is a large image. Might run out of memory.
            </span>
          )}
          <div className="ml-auto pt-6 grid grid-cols-2 gap-4 col-start-2">
            <button
              onClick={handleExport}
              className="bg-indigo-300 text-indigo-700 rounded-md px-4 py-2 "
            >
              Export
            </button>
            <button
              onClick={closeModal}
              className="bg-indigo-300 text-indigo-700 rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PNGModal;
