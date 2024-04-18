import {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../../types/configuration";

type BooleanInputProps = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: ConfigurationVariantsT;
};

const BooleanInput: React.FunctionComponent<BooleanInputProps> = ({
  variant,
  attribute,
  info,
}) => {
  return (
    <div className="grid grid-cols-1 text-lg py-2 grid-rows-1">
      <div className="flex flex-row items-center">
        <div className="flex items-center checkbox-container">
          <input
            id={`${variant}-${attribute}`}
            type="checkbox"
            name={`${variant}-${attribute}`}
            className="checkbox"
          ></input>
          <label htmlFor={`${variant}-${attribute}`}>{info.display}</label>
        </div>
      </div>
    </div>
  );
};

export default BooleanInput;
