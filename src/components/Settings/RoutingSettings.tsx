import React, { useEffect, useRef } from "react";
import { RoutingConfigT } from "../../types/configuration";

type RoutingSettingsT = {
  observedAlgorithm: string | undefined;
  algorithms: string[];
  promiseRef: React.MutableRefObject<
    (() => Promise<RoutingConfigT>) | undefined
  >;
};

const RoutingSettings: React.FunctionComponent<RoutingSettingsT> = ({
  observedAlgorithm,
  algorithms,
  promiseRef,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const selectName = "algorithm-select";
  const sinksSourcesName = "sinks-sources-checkbox";

  const generatePromise = () =>
    new Promise<RoutingConfigT>((resolve, reject) => {
      if (formRef.current) {
        const form = formRef.current;

        const select = form[selectName] as HTMLInputElement | null;
        const sinksSources = form[sinksSourcesName] as HTMLInputElement | null;

        if (select && sinksSources) {
          resolve({
            routingConfig: select.value === "None" ? undefined : select.value,
            sinksSources: sinksSources.checked,
          });
        } else {
          resolve({ sinksSources: false });
        }
      }

      reject("Something went wrong extracting the input. Please try again.");
    });

  useEffect(() => {
    promiseRef.current = generatePromise;
  }, [formRef]);

  return (
    <div className="flex flex-col mt-10 px-2">
      <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
        <h4>Routing information</h4>
      </span>
      <form
        className="mt-2"
        onSubmit={(ev) => ev.preventDefault()}
        ref={formRef}
      >
        <div>
          <div className="flex items-center pb-4">
            <label htmlFor={selectName} className="whitespace-pre-wrap">
              Routing algorithm{" "}
            </label>
            <div className="content dropdown-wrapper">
              <select
                name={selectName}
                id={selectName}
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
      </form>
    </div>
  );
};

export default RoutingSettings;
