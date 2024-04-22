import { useFormContext, useWatch } from "react-hook-form";
import { FieldNameT } from "../../..";
import {
  ConfigurableBaseConfigurationAttributeT,
  ConfigurationVariantsT,
} from "../../../../../types/configuration";
import { CSSPropertiesWithProperties } from "../../../../../types/css";
import "./index.css";

type FontSizeInputProps = {
  attribute: string;
  variant: ConfigurationVariantsT;
  specifics: ConfigurableBaseConfigurationAttributeT;
  index: number;
};

const FontSizeInput: React.FunctionComponent<FontSizeInputProps> = ({
  attribute,
  variant,
  specifics,
  index,
}) => {
  const name: FieldNameT = `${variant}.${index}.${attribute}`;
  const { register, control, setValue } = useFormContext();
  const value = useWatch({ name, control });

  return (
    <div className="flex flex-col text-lg py-2 grid-rows-1">
      <span>
        <label htmlFor={name}>{specifics.display}</label>: {value}px
      </span>
      <div className="flex flex-row w-full justify-between items-center">
        <span>{specifics.min}</span>
        <input
          id={name}
          type="range"
          step={1}
          min={specifics.min}
          max={specifics.max}
          className="slider"
          style={
            {
              "--min": specifics.min,
              "--range": specifics.max - specifics.min,
              "--value": value,
            } as CSSPropertiesWithProperties
          }
          {...register(name, {
            min: specifics.min,
            max: specifics.max,
            valueAsNumber: true,
            onChange: (ev) => {
              let newVal = parseInt(ev.target.value);
              if (isNaN(newVal)) newVal = specifics.default;

              setValue(name, newVal);
            },
          })}
        ></input>
        <span>{specifics.max}</span>
      </div>
    </div>
  );
};

export default FontSizeInput;
