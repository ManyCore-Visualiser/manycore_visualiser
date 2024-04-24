import { createContext, useContext, useRef } from "react";

import { useSettingsContext } from "..";
import { ConfigurationVariantsT } from "../../../types/configuration";
import Modal, { useModalContext } from "../../Modal";

export type DisplayModalContextDataT = {
  attributeDisplay?: string;
  attribute?: string;
  variant?: ConfigurationVariantsT;
};

type DisplayModalContextT = {
  data: DisplayModalContextDataT;
  setData: React.Dispatch<React.SetStateAction<DisplayModalContextDataT>>;
};

export const DisplayModalContext = createContext<DisplayModalContextT | null>(
  null
);

const DisplayModal: React.FunctionComponent = () => {
  const { displayMap, dispatchDisplayMap } = useSettingsContext();
  const { setDisplay } = useModalContext();
  const {
    data: { attribute, attributeDisplay, variant },
  } = useDisplayModalContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const mapKey = `${variant}-${attribute}`;

  function closeModal() {
    setDisplay(false);
  }

  function handleSave() {
    if (inputRef.current && inputRef.current.value.length > 0) {
      dispatchDisplayMap({
        attribute: mapKey,
        display: inputRef.current.value,
      });
      // Clear input field
      inputRef.current.value = "";
    }
    closeModal();
  }

  return (
    <Modal>
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
    </Modal>
  );
};

export function useDisplayModalContext() {
  const ctx = useContext(DisplayModalContext);

  if (!ctx) {
    throw new Error("DisplayModalContext must be used within a provider");
  }

  return ctx;
}

export default DisplayModal;
