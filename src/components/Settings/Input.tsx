import { useRef, useState } from "react";
import type { ProcessedAttributesGroupContentT } from "../../types/configuration";
import TwotoneTextFields from "../icons/TwotoneTextFields";
import DisplayModal from "./DisplayModal";
import { DisplayMapDispatchActionT } from "../../types/displayMap";

type InputT = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: "Cores" | "Routers";
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
};

type AttributeVariantsT = "Text" | "ColouredText" | "Fill";

const Input: React.FunctionComponent<InputT> = ({
  attribute,
  info,
  variant,
  dispatchDisplayMap,
}) => {
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState<AttributeVariantsT>("Text");
  const modalRef = useRef<HTMLDialogElement>(null);

  function showModal() {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  return (
    <>
      <div
        className={`grid grid-cols-1 text-lg pb-4 ${
          checked && info.type === "number" && type !== "Text"
            ? "grid-rows-2"
            : "grid-rows-1"
        }`}
      >
        <div className="flex flex-row items-center">
          <div className="flex items-center checkbox-container">
            <input
              id={`${attribute}-${variant}`}
              type="checkbox"
              name={`${attribute}`}
              className="checkbox"
              onChange={(ev) => setChecked(ev.target.checked)}
            ></input>
            <label htmlFor={`${attribute}-${variant}`}>{info.display}</label>
          </div>
          {info.type === "number" && (
            <>
              <span className="whitespace-pre-wrap"> as </span>
              <div className="content dropdown-wrapper">
                <select
                  name={`${attribute}-select`}
                  id={`${attribute}-select`}
                  disabled={!checked}
                  onChange={(ev) =>
                    setType(ev.target.value as AttributeVariantsT)
                  }
                  className="appearance-none dropdown"
                >
                  <option value="Text">Text</option>
                  <option value="ColouredText">Coloured text</option>
                  <option value="Fill">Fill colour</option>
                </select>
              </div>
            </>
          )}
          {attribute === "@coordinates" && (
            <>
              <span className="whitespace-pre-wrap"> from </span>
              <div className="content dropdown-wrapper">
                <select
                  name={`${attribute}-select`}
                  id={`${attribute}-select`}
                  disabled={!checked}
                  defaultValue="T"
                  className="appearance-none dropdown"
                >
                  <option value="T">Top left</option>
                  <option value="B">Bottom left</option>
                </select>
              </div>
            </>
          )}
          {attribute != "@coordinates" && type !== "Fill" && checked && (
            <button onClick={showModal}>
              <TwotoneTextFields width="1em" height="1em" className="ml-4" />
            </button>
          )}
        </div>
        {checked && type !== "Text" && (
          <div>
            <div className="grid grid-rows-1 grid-cols-4 gap-2">
              <div className="col-span-1 flex flex-col">
                <input
                  name={`${attribute}-0c`}
                  type="color"
                  className="min-w-0 colour colour-left"
                />
                <input
                  name={`${attribute}-0v`}
                  type="number"
                  className="min-w-0 number"
                  defaultValue={0}
                  min={0}
                  max={65535}
                />
              </div>
              <div className="col-span-1 flex flex-col">
                <input
                  name={`${attribute}-1c`}
                  type="color"
                  className="min-w-0 colour"
                />
                <input
                  name={`${attribute}-1v`}
                  type="number"
                  className="min-w-0 number"
                  defaultValue={0}
                  min={0}
                  max={65535}
                />
              </div>
              <div className="col-span-1 flex flex-col">
                <input
                  name={`${attribute}-2c`}
                  type="color"
                  className="min-w-0 colour"
                />
                <input
                  name={`${attribute}-2v`}
                  type="number"
                  className="min-w-0 number"
                  defaultValue={0}
                  min={0}
                  max={65535}
                />
              </div>
              <div className="col-span-1 flex flex-col">
                <input
                  name={`${attribute}-3c`}
                  type="color"
                  className="min-w-0 colour colour-right"
                />
                <input
                  name={`${attribute}-3v`}
                  type="number"
                  className="min-w-0 number"
                  defaultValue={0}
                  min={0}
                  max={65535}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <DisplayModal
        mref={modalRef}
        attributeDisplay={info.display}
        dispatchDisplayMap={dispatchDisplayMap}
        attribute={attribute}
      />
    </>
  );
};

export default Input;
