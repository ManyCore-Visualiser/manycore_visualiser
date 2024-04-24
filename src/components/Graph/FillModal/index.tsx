import { useEffect, useRef } from "react";
import { useAppContext } from "../../../App";
import { DispatchFillOverrideGroupT } from "../../../types/configuration";
import Modal, { useModalContext } from "../../Modal";
import "../../Settings/colour.css";

type FillModalProps = {
  elementId: string;
  name: string;
};

const FillModal: React.FunctionComponent<FillModalProps> = ({
  name,
  elementId,
}) => {
  const { setDisplay } = useModalContext();
  const { coreFills, routerFills, dispatchCoreFills, dispatchRouterFills } =
    useAppContext();

  const [variant, map] =
    elementId.at(0) === "c" ? ["Core", coreFills] : ["Router", routerFills];
  const id = parseInt(elementId.slice(1));
  const inputRef = useRef<HTMLInputElement>(null);

  function closeModal() {
    setDisplay((prev) => (prev === name ? null : prev));
  }

  function handleSave() {
    if (inputRef.current) {
      if (!isNaN(id)) {
        const dispatchValue: DispatchFillOverrideGroupT = {
          type: "add",
          id,
          colour: inputRef.current.value,
        };
        switch (variant) {
          default:
          case "Core":
            dispatchCoreFills(dispatchValue);
            break;
          case "Router":
            dispatchRouterFills(dispatchValue);
            break;
        }
        inputRef.current.value = "";
      }
    }

    closeModal();
  }

  // When element/id change, update default colour
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = map.get(id) ?? "#e5e5e5";
  }, [map, id]);

  return (
    <Modal name={name}>
      <div className="flex flex-col">
        <h5 className="text-3xl text-indigo-500">
          Override {variant} {id} fill colour
        </h5>
        <span className="flex items-center pt-4">
          <label htmlFor="core-fill-colour">Fill colour:</label>
          <input
            id="core-fill-colour"
            ref={inputRef}
            type="color"
            className="colour-button"
          ></input>
        </span>
        <div className="ml-auto pt-6 grid grid-cols-2 grid-rows-1 gap-4">
          <button
            onClick={handleSave}
            className="bg-indigo-300 text-indigo-700 rounded-md px-4 py-2"
          >
            Save
          </button>
          <button
            onClick={closeModal}
            className="bg-indigo-300 text-indigo-700 rounded-md px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FillModal;
