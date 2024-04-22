import { useFormContext } from "react-hook-form";
import { FieldNameT } from "../..";
import { ConfigurationVariantsT } from "../../../../types/configuration";

type BooleanInputProps = {
  attribute: string;
  display: string;
  variant: ConfigurationVariantsT;
  index: number;
};

const BooleanInput: React.FunctionComponent<BooleanInputProps> = ({
  variant,
  attribute,
  display,
  index,
}) => {
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const { register } = useFormContext();

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
