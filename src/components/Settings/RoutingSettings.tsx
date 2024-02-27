import React, { useEffect, useRef } from "react";

type RoutingSettingsT = {
  observedAlgorithm: string | undefined;
  algorithms: string[];
  promiseRef: React.MutableRefObject<
    (() => Promise<string | undefined>) | undefined
  >;
};

const RoutingSettings: React.FunctionComponent<RoutingSettingsT> = ({
  observedAlgorithm,
  algorithms,
  promiseRef,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const selectName = "algorithm-select";

  const generatePromise = () =>
    new Promise<string | undefined>((resolve, reject) => {
      if (formRef.current) {
        const form = formRef.current;

        const select = form[selectName] as HTMLInputElement | null;

        if (select && select.value !== "None") {
          resolve(select.value);
        } else {
          resolve(undefined);
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
        <div className="flex">
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
      </form>
    </div>
  );
};

export default RoutingSettings;
