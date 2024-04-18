import { useRef, useState } from "react";
import {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import DisplayModal from "../../DisplayModal";

type TextInputProps = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const TextInput: React.FunctionComponent<TextInputProps> = ({
  attribute,
  info,
  variant,
  dispatchDisplayMap,
}) => {
  const [checked, setChecked] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  function showModal() {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 text-lg py-2 grid-rows-1">
        <div className="flex flex-row items-center">
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
          {checked && (
            <button onClick={showModal} type="button">
              <TwotoneTextFields width="1em" height="1em" className="ml-4" />
            </button>
          )}
        </div>
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

export default TextInput;
