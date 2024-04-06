import { useState } from "react";
import type { ConfigurationVariantsT } from "../../../types/configuration";
import ColourBoundaries from "./ColourBoundaries";

type RoutingInputProps = {
  observedAlgorithm: string | undefined;
  algorithms: string[];
  // algorithmSelectName: string;
  // loadSelectName: string;
  variant: ConfigurationVariantsT;
  attribute: string;
};

// type LoadConfigurationT = "percentage" | "fraction";

const RoutingInput: React.FunctionComponent<RoutingInputProps> = ({
  observedAlgorithm,
  algorithms,
  // algorithmSelectName,
  // loadSelectName,
  variant,
  attribute,
}) => {
  const [checked, setChecked] = useState(false);
  const none = "None";

  return (
    <div className="px-1">
      <div className="flex items-center py-2 text-lg">
        <label
          htmlFor={`${variant}-${attribute}-algo-select`}
          className="whitespace-pre-wrap"
        >
          Routing algorithm{" "}
        </label>
        <div className="content dropdown-wrapper">
          <select
            name={`${variant}-${attribute}-algo-select`}
            id={`${variant}-${attribute}-algo-select`}
            disabled={!algorithms}
            className="appearance-none dropdown"
            defaultValue={undefined}
            onChange={(ev) => setChecked(ev.target.value !== none)}
          >
            <option>{none}</option>
            {algorithms.map((algorithm) => (
              <option key={algorithm} value={algorithm}>
                {algorithm === "Observed" && observedAlgorithm
                  ? `${algorithm} (${observedAlgorithm})`
                  : algorithm}
              </option>
            ))}
          </select>
        </div>
      </div>
      {checked && (
        <div className="flex flex-col text-lg py-2">
          <div className="flex flex-row items-center pb-2">
            <span className="whitespace-pre-wrap">Loads as </span>
            <div className="content dropdown-wrapper">
              <select
                name={`${variant}-${attribute}-load-select`}
                id={`${variant}-${attribute}-load-select`}
                className="appearance-none dropdown"
                defaultValue="percentage"
              >
                <option value="Percentage">Percentage</option>
                <option value="Fraction">Fraction</option>
              </select>
            </div>
          </div>
          <ColourBoundaries attribute={`${attribute}-load`} variant={variant} />
          <span className="text-zinc-300 font-normal text-justify">
            The above boundaries are w.r.t 100% of bandwidth usage. Use values
            between 0-100 to configure each colour step.
          </span>
        </div>
      )}
    </div>
  );
};

export default RoutingInput;
