import { useFormContext, useWatch } from "react-hook-form";
import { FieldNameT } from "../..";
import { ConfigurationVariantsT } from "../../../../types/configuration";

import { useModalContext } from "../../../Modal";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import { useDisplayModalContext } from "../../DisplayModal";

type TextInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  index: number;
};

const TextInput: React.FunctionComponent<TextInputProps> = ({
  attribute,
  display,
  variant,
  index,
}) => {
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const colourName: FieldNameT = `${variant}.${index}.${attribute}-colour`;
  const { register, control } = useFormContext();
  const checked = useWatch({ name, control });

  const { setDisplay } = useModalContext();
  const { setData } = useDisplayModalContext();

  function showModal() {
    setData({
      attribute,
      attributeDisplay: display,
      variant,
    });

    setDisplay("display");
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
              {...register(name)}
            ></input>
            <label htmlFor={name}>{display}</label>
          </div>
          {checked && (
            <>
              <button onClick={showModal} type="button">
                <TwotoneTextFields width="1em" height="1em" className="ml-4" />
              </button>
              <input
                type="color"
                className="colour-button"
                id={colourName}
                {...register(colourName)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TextInput;
