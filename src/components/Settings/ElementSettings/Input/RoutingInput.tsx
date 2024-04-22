import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FieldNameT } from "../..";
import { useAppContext } from "../../../../App";
import type { ConfigurationVariantsT } from "../../../../types/configuration";
import TwotoneTextFields from "../../../icons/TwotoneTextFields";
import DisplayModal from "../../DisplayModal";
import ColourBoundaries from "./ColourBoundaries";

type RoutingInputProps = {
  variant: ConfigurationVariantsT;
  attribute: string;
  display: string;
  index: number;
};

const RoutingInput: React.FunctionComponent<RoutingInputProps> = ({
  variant,
  attribute,
  display,
  index,
}) => {
  const { attributes } = useAppContext();
  const { algorithms, observedAlgorithm } = attributes || {};

  const none = "None";
  const algoName: FieldNameT = `${variant}.${index}.${attribute}-algo-select`;
  const loadName: FieldNameT = `${variant}.${index}.${attribute}-load`;
  const loadSelectName: FieldNameT = `${loadName}-select`;

  const modalRef = useRef<HTMLDialogElement>(null);

  const { register, control } = useFormContext();
  const selectedAlgorithm = useWatch({ name: algoName, control });

  function showModal() {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }

  return (
    <>
      <div className="px-1">
        <div className="flex items-center py-2 text-lg">
          <label htmlFor={algoName} className="whitespace-pre-wrap">
            Routing algorithm{" "}
          </label>
          <div className="content dropdown-wrapper">
            <select
              disabled={!algorithms}
              className="appearance-none dropdown"
              {...register(algoName)}
            >
              <option>{none}</option>
              {algorithms?.map((algorithm) => (
                <option key={algorithm} value={algorithm}>
                  {algorithm === "Observed" && observedAlgorithm
                    ? `${algorithm} (${observedAlgorithm})`
                    : algorithm}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedAlgorithm !== none && (
          <div className="flex flex-col text-lg py-2">
            <div className="flex flex-row items-center pb-2">
              <span className="whitespace-pre-wrap">{display} as </span>
              <div className="content dropdown-wrapper">
                <select
                  className="appearance-none dropdown"
                  defaultValue="percentage"
                  {...register(loadSelectName)}
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fraction">Fraction</option>
                </select>
              </div>
              <button onClick={showModal} type="button">
                <TwotoneTextFields width="1em" height="1em" className="ml-4" />
              </button>
            </div>
            <ColourBoundaries baseName={loadName} />
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
        attributeDisplay={display}
        attribute={attribute}
      />
    </>
  );
};

export default RoutingInput;
