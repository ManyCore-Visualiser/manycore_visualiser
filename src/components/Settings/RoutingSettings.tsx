import React from "react";

type RoutingSettingsT = {
  observedAlgorithm: string | undefined;
  algorithms: string[];
  algorithmSelectName: string;
  sinksSourcesName: string;
};

const RoutingSettings: React.FunctionComponent<RoutingSettingsT> = ({
  observedAlgorithm,
  algorithms,
  algorithmSelectName,
  sinksSourcesName,
}) => {
  return (
    <div className="flex flex-col mt-10 px-2">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>Routing information</h4>
      </span>
      <div>
        <div className="flex items-center pb-4">
          <label htmlFor={algorithmSelectName} className="whitespace-pre-wrap">
            Routing algorithm{" "}
          </label>
          <div className="content dropdown-wrapper">
            <select
              name={algorithmSelectName}
              id={algorithmSelectName}
              disabled={!algorithms}
              className="appearance-none dropdown"
              defaultValue={undefined}
            >
              <option>None</option>
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
        <div className="flex items-center checkbox-container pb-4">
          <input
            id={sinksSourcesName}
            type="checkbox"
            name={sinksSourcesName}
            className="checkbox"
          ></input>
          <label htmlFor={sinksSourcesName}>Show sinks/sources</label>
        </div>
      </div>
    </div>
  );
};

export default RoutingSettings;
