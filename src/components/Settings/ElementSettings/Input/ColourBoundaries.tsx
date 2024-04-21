import { UseFormRegister } from "react-hook-form";
import { FieldNameT, FormValues } from "../..";

type ColourBoundariesProps = {
  max?: number;
  register: UseFormRegister<FormValues>;
  baseName: FieldNameT;
};

const ColourBoundaries: React.FunctionComponent<ColourBoundariesProps> = ({
  max = 65535,
  register,
  baseName,
}) => {
  return (
    <div className="grid grid-rows-1 grid-cols-4 gap-2 py-2">
      <div className="col-span-1 flex flex-col">
        <input
          type="color"
          className="min-w-0 colour colour-left"
          {...register(`${baseName}-0c`)}
        />
        <input
          type="number"
          className="min-w-0 number"
          min={0}
          max={max}
          {...register(`${baseName}-0v`, {
            valueAsNumber: true,
            min: 0,
            max: max,
          })}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          type="color"
          className="min-w-0 colour"
          {...register(`${baseName}-1c`)}
        />
        <input
          type="number"
          className="min-w-0 number"
          min={0}
          max={max}
          {...register(`${baseName}-1v`, {
            valueAsNumber: true,
            min: 0,
            max: max,
          })}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          type="color"
          className="min-w-0 colour"
          {...register(`${baseName}-2c`)}
        />
        <input
          type="number"
          className="min-w-0 number"
          min={0}
          max={max}
          {...register(`${baseName}-2v`, {
            valueAsNumber: true,
            min: 0,
            max: max,
          })}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          type="color"
          className="min-w-0 colour colour-right"
          {...register(`${baseName}-3c`)}
        />
        <input
          type="number"
          className="min-w-0 number"
          min={0}
          max={max}
          {...register(`${baseName}-3v`, {
            valueAsNumber: true,
            min: 0,
            max: max,
          })}
        />
      </div>
    </div>
  );
};

export default ColourBoundaries;
