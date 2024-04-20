import { useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FieldNameT, FormValues } from "../..";
import { ConfigurationVariantsT } from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import DisplayModal from "../../DisplayModal";

type TextInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  index: number;
  register: UseFormRegister<FormValues>;
};

const TextInput: React.FunctionComponent<TextInputProps> = ({
  attribute,
  display,
  variant,
  dispatchDisplayMap,
  index,
  register,
}) => {
  const [checked, setChecked] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const name: FieldNameT = `${variant}.${index}.${attribute}`;

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
              type="checkbox"
              className="checkbox"
              id={name}
              {...register(name, {
                onChange: (ev) => setChecked(ev.target.checked),
              })}
            ></input>
            <label htmlFor={name}>{display}</label>
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
        attributeDisplay={display}
        dispatchDisplayMap={dispatchDisplayMap}
        attribute={attribute}
      />
    </>
  );
};

export default TextInput;
