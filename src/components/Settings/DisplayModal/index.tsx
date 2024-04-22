import { useRef } from "react";
import { createPortal } from "react-dom";
import { useSettingsContext } from "..";
import { ConfigurationVariantsT } from "../../../types/configuration";
import "./style.css";

type DisplayModalT = {
  mref: React.RefObject<HTMLDialogElement>;
  attributeDisplay: string;
  attribute: string;
  variant: ConfigurationVariantsT;
};

const DisplayModal: React.FunctionComponent<DisplayModalT> = ({
  mref,
  attributeDisplay,
  attribute,
  variant,
}) => {
  const { displayMap, dispatchDisplayMap } = useSettingsContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const mapKey = `${variant}-${attribute}`;

  function closeModal() {
    if (mref.current) {
      mref.current.close();
    }
  }

  function handleSave() {
    if (inputRef.current && inputRef.current.value.length > 0) {
      dispatchDisplayMap({
        attribute: mapKey,
        display: inputRef.current.value,
      });
    }
    closeModal();
  }

  return (
    <>
      {createPortal(
        <dialog ref={mref} className="modal">
          <div className="flex flex-col">
            <h5 className="text-3xl text-indigo-500">
              Display "{attributeDisplay}" as:
            </h5>
            <input
              ref={inputRef}
              type="text"
              placeholder={
                displayMap && displayMap[mapKey]
                  ? displayMap[mapKey]
                  : attributeDisplay
              }
              // TODO: Do not use outline-none, bad for accessibility
              className="bg-transparent border-b-2 border-b-white focus:outline-none pt-4"
            ></input>
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
        </dialog>,
        document.body
      )}
    </>
  );
};

export default DisplayModal;
