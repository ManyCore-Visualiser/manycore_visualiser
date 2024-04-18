import { useState } from "react";
import {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../../types/configuration";

type CoordinatesInputProps = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: ConfigurationVariantsT;
};

const CoordinatesInput: React.FunctionComponent<CoordinatesInputProps> = ({
  attribute,
  variant,
  info,
}) => {
  const [checked, setChecked] = useState(false);

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
          <span className="whitespace-pre-wrap"> from </span>
          <div className="content dropdown-wrapper">
            <select
              name={`${variant}-${attribute}-select`}
              id={`${variant}-${attribute}-select`}
              disabled={!checked}
              defaultValue="T"
              className="appearance-none dropdown"
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
