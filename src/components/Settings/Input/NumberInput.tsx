import { useRef, useState } from "react";
import {
  AttributeVariantsT,
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../types/configuration";
import DisplayModal from "../DisplayModal";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import TwotoneTextFields from "../../icons/TwotoneTextFields";
import ColourBoundaries from "./ColourBoundaries";

type NumberInputProps = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const NumberInput: React.FunctionComponent<NumberInputProps> = ({
  attribute,
  info,
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
}) => {
  const [type, setType] = useState<AttributeVariantsT>("Text");
  const [checked, setChecked] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);

  function showModal() {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  return (
    <>
      <div className={`flex flex-col text-lg`}>
        <div className="flex flex-row items-center py-2">
          <div className="flex items-center checkbox-container">
            <input
              id={`${variant}-${attribute}`}
              type="checkbox"
              name={`${variant}-${attribute}`}
              className="checkbox"
              onChange={(ev) => setChecked(ev.target.checked)}
            ></input>
            <label htmlFor={`${variant}-${attribute}`}>{info.display}</label>
          </div>
          <span className="whitespace-pre-wrap"> as </span>
          <div className="content dropdown-wrapper">
            <select
              name={`${variant}-${attribute}-select`}
              id={`${variant}-${attribute}-select`}
              disabled={!checked}
              onChange={(ev) => {
                setType(ev.target.value as AttributeVariantsT);

                if (ev.target.value === "Fill") {
                  setFillSelected(attribute);
                } else if (fillSelected === attribute) {
                  setFillSelected(undefined);
                }
              }}
              className="appearance-none dropdown"
            >
              <option value="Text">Text</option>
              <option value="ColouredText">Coloured text</option>
              {variant !== "Channels" && (
                <option
                  value="Fill"
                  disabled={
                    fillSelected !== undefined && fillSelected !== attribute
                  }
                >
                  Fill colour
                </option>
              )}
            </select>
          </div>
          {type !== "Fill" && variant !== "Channels" && checked && (
            <button onClick={showModal} type="button">
              <TwotoneTextFields width="1em" height="1em" className="ml-4" />
            </button>
          )}
        </div>
        {checked && type !== "Text" && (
          <ColourBoundaries attribute={attribute} variant={variant} />
        )}
      </div>
      <DisplayModal
        variant={variant}
        mref={modalRef}
        attributeDisplay={info.display}
        dispatchDisplayMap={dispatchDisplayMap}
        attribute={attribute}
      />
    </>
  );
};

export default NumberInput;
