import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FieldNameT, FormValues } from "../..";
import { ConfigurationVariantsT } from "../../../../types/configuration";

type CoordinatesInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  index: number;
  register: UseFormRegister<FormValues>;
};

const CoordinatesInput: React.FunctionComponent<CoordinatesInputProps> = ({
  attribute,
  variant,
  display,
  index,
  register,
}) => {
  const [checked, setChecked] = useState(false);
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const selectName: FieldNameT = `${variant}.${index}.${attribute}-select`;

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
          <span className="whitespace-pre-wrap"> from </span>
          <div className="content dropdown-wrapper">
            <select
              disabled={!checked}
              defaultValue="T"
              className="appearance-none dropdown"
              {...register(selectName)}
            >
              <option value="T">Top left</option>
              <option value="B">Bottom left</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoordinatesInput;
