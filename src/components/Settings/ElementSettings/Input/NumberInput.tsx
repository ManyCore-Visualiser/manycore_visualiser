import { useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FieldNameT, FormValues } from "../..";
import {
  AttributeVariantsT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import DisplayModal from "../../DisplayModal";
import ColourBoundaries from "./ColourBoundaries";

type NumberInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  index: number;
  register: UseFormRegister<FormValues>;
};

const NumberInput: React.FunctionComponent<NumberInputProps> = ({
  attribute,
  display,
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
  index,
  register,
}) => {
  const [type, setType] = useState<AttributeVariantsT>("Text");
  const [checked, setChecked] = useState(false);
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const selectName: FieldNameT = `${variant}.${index}.${attribute}-select`;

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
              type="checkbox"
              className="checkbox"
              id={name}
              {...register(name, {
                onChange: (ev) => setChecked(ev.target.checked),
              })}
            ></input>
            <label htmlFor={name}>{display}</label>
          </div>
          <span className="whitespace-pre-wrap"> as </span>
          <div className="content dropdown-wrapper">
            <select
              disabled={!checked}
              {...register(selectName, {
                onChange: (ev) => {
                  setType(ev.target.value as AttributeVariantsT);

                  if (ev.target.value === "Fill") {
                    setFillSelected(attribute);
                  } else if (fillSelected === attribute) {
                    setFillSelected(undefined);
                  }
                },
              })}
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
          {type !== "Fill" && checked && (
            <button onClick={showModal} type="button">
              <TwotoneTextFields width="1em" height="1em" className="ml-4" />
            </button>
          )}
        </div>
        {checked && type !== "Text" && (
          <ColourBoundaries register={register} baseName={name} />
        )}
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

export default NumberInput;
