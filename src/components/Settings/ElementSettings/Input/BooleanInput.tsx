import { UseFormRegister } from "react-hook-form";
import { FieldNameT, FormValues } from "../..";
import {
  ConfigurationVariantsT
} from "../../../../types/configuration";

type BooleanInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  index: number;
  register: UseFormRegister<FormValues>;
};

const BooleanInput: React.FunctionComponent<BooleanInputProps> = ({
  variant,
  attribute,
  display,
  index,
  register,
}) => {
  const name: FieldNameT = `${variant}.${index}.${attribute}`;

  return (
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
      </div>
    </div>
  );
};

export default BooleanInput;
