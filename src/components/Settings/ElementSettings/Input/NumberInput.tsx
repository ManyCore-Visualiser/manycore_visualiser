import { useFormContext, useWatch } from "react-hook-form";
import { FieldNameT } from "../..";
import { ConfigurationVariantsT } from "../../../../types/configuration";
import { useModalContext } from "../../../Modal";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import { useDisplayModalContext } from "../../DisplayModal";
import ColourBoundaries from "./ColourBoundaries";

type NumberInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  index: number;
};

const NumberInput: React.FunctionComponent<NumberInputProps> = ({
  attribute,
  display,
  variant,
  fillSelected,
  setFillSelected,
  index,
}) => {
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const colourName: FieldNameT = `${variant}.${index}.${attribute}-colour`;
  const selectName: FieldNameT = `${variant}.${index}.${attribute}-select`;

  const { register, control } = useFormContext();
  const checked = useWatch({ name, control });
  const type = useWatch({ name: selectName, control });

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
      <div className={`flex flex-col text-lg`}>
        <div className="flex flex-row items-center py-2">
          <div className="flex items-center checkbox-container">
            <input
              type="checkbox"
              className="checkbox"
              id={name}
              {...register(name)}
            ></input>
            <label htmlFor={name}>{display}</label>
          </div>
          <span className="whitespace-pre-wrap"> as </span>
          <div className="content dropdown-wrapper">
            <select
              disabled={!checked}
              {...register(selectName, {
                onChange: (ev) => {
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
            <>
              <button onClick={showModal} type="button">
                <TwotoneTextFields width="1em" height="1em" className="ml-4" />
              </button>
              {type !== "ColouredText" && (
                <input
                  type="color"
                  className="colour-button"
                  id={colourName}
                  {...register(colourName)}
                />
              )}
            </>
          )}
        </div>
        {checked && type !== "Text" && <ColourBoundaries baseName={name} />}
      </div>
    </>
  );
};

export default NumberInput;
