import { useRef, useState } from "react";
import type {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../types/displayMap";
import TwotoneTextFields from "../../icons/TwotoneTextFields";
import DisplayModal from "../DisplayModal";
import ColourBoundaries from "./ColourBoundaries";

type RoutingInputProps = {
  observedAlgorithm: string | undefined;
  algorithms: string[];
  variant: ConfigurationVariantsT;
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
};

const RoutingInput: React.FunctionComponent<RoutingInputProps> = ({
  observedAlgorithm,
  algorithms,
  variant,
  attribute,
  info,
  dispatchDisplayMap,
}) => {
  const [checked, setChecked] = useState(false);
  const none = "None";

  const modalRef = useRef<HTMLDialogElement>(null);

  function showModal() {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  return (
    <>
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
              <button onClick={showModal} type="button">
                <TwotoneTextFields width="1em" height="1em" className="ml-4" />
              </button>
            </div>
            <ColourBoundaries
              attribute={`${attribute}-load`}
              variant={variant}
            />
            <span className="text-zinc-300 font-normal text-justify">
              The above boundaries are w.r.t 100% of bandwidth usage. Use values
              between 0-100 to configure each colour step.
            </span>
          </div>
        )}
      </div>
      <DisplayModal
        variant={variant}
        mref={modalRef}
        attributeDisplay={info.display}
        dispatchDisplayMap={dispatchDisplayMap}
        attribute={attribute}
      />
    </>
  );
};

export default RoutingInput;
