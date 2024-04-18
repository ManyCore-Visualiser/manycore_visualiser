import { useState } from "react";
import { ConfigurableBaseConfigurationAttributeT } from "../../../../../types/configuration";
import "./index.css";
import { CSSPropertiesWithProperties } from "../../../../../types/css";

type FontSizeInputProps = {
  attribute: string;
  variant: string;
  specifics: ConfigurableBaseConfigurationAttributeT;
};

const FontSizeInput: React.FunctionComponent<FontSizeInputProps> = ({
  attribute,
  variant,
  specifics,
}) => {
  const [value, setValue] = useState<number>(specifics.default);

  return (
    <div className="flex flex-col text-lg py-2 grid-rows-1">
      <span>
        <label htmlFor={`${variant}-${attribute}`}>{specifics.display}</label>:{" "}
        {value}px
      </span>
      <div className="flex flex-row w-full justify-between items-center">
        <span>{specifics.min}</span>
        <input
          id={`${variant}-${attribute}`}
          type="range"
          min={specifics.min}
          max={specifics.max}
          step={1}
          name={`${variant}-${attribute}`}
          defaultValue={specifics.default}
          className="slider"
          style={
            {
              "--min": specifics.min,
              "--range": specifics.max - specifics.min,
              "--value": value,
            } as CSSPropertiesWithProperties
          }
          onChange={(ev) =>
            setValue(() => {
              let newVal = parseInt(ev.target.value);
              if (isNaN(newVal)) newVal = specifics.default;

              return newVal;
            })
          }
        ></input>
        <span>{specifics.max}</span>
      </div>
    </div>
  );
};

export default FontSizeInput;
