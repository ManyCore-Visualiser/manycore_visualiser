import { ConfigurationVariantsT } from "../../../../types/configuration";

type ColourBoundariesProps = {
  attribute: string;
  variant: ConfigurationVariantsT;
  max?: number;
};

const ColourBoundaries: React.FunctionComponent<ColourBoundariesProps> = ({
  variant,
  attribute,
  max = 65535,
}) => {
  return (
    <div className="grid grid-rows-1 grid-cols-4 gap-2 py-2">
      <div className="col-span-1 flex flex-col">
        <input
          name={`${variant}-${attribute}-0c`}
          type="color"
          className="min-w-0 colour colour-left"
        />
        <input
          name={`${variant}-${attribute}-0v`}
          type="number"
          className="min-w-0 number"
          defaultValue={0}
          min={0}
          max={max}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          name={`${variant}-${attribute}-1c`}
          type="color"
          className="min-w-0 colour"
        />
        <input
          name={`${variant}-${attribute}-1v`}
          type="number"
          className="min-w-0 number"
          defaultValue={0}
          min={0}
          max={max}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          name={`${variant}-${attribute}-2c`}
          type="color"
          className="min-w-0 colour"
        />
        <input
          name={`${variant}-${attribute}-2v`}
          type="number"
          className="min-w-0 number"
          defaultValue={0}
          min={0}
          max={max}
        />
      </div>
      <div className="col-span-1 flex flex-col">
        <input
          name={`${variant}-${attribute}-3c`}
          type="color"
          className="min-w-0 colour colour-right"
        />
        <input
          name={`${variant}-${attribute}-3v`}
          type="number"
          className="min-w-0 number"
          defaultValue={0}
          min={0}
          max={max}
        />
      </div>
    </div>
  );
};

export default ColourBoundaries;
