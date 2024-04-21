import { UseFormRegister } from "react-hook-form";
import { FormValues } from "../..";
import type {
  AttributeTypeT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import BooleanInput from "./BooleanInput";
import CoordinatesInput from "./CoordinatesInput";
import NumberInput from "./NumberInput";
import RoutingInput from "./RoutingInput";
import TextInput from "./TextInput";

type InputT = {
  attribute: string;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  observedAlgorithm?: string | undefined;
  algorithms?: string[];
  index: number;
  register: UseFormRegister<FormValues>;
  type: AttributeTypeT;
  display: string;
};

const Input: React.FunctionComponent<InputT> = ({
  attribute,
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
  algorithms,
  observedAlgorithm,
  index,
  register,
  type,
  display,
}) => {
  switch (type) {
    case "boolean":
      return (
        <BooleanInput
          attribute={attribute}
          display={display}
          variant={variant}
          index={index}
          register={register}
        />
      );
    case "coordinates":
      return (
        <CoordinatesInput
          attribute={attribute}
          display={display}
          variant={variant}
          index={index}
          register={register}
        />
      );
    case "text":
      return (
        <TextInput
          attribute={attribute}
          dispatchDisplayMap={dispatchDisplayMap}
          fillSelected={fillSelected}
          display={display}
          setFillSelected={setFillSelected}
          variant={variant}
          index={index}
          register={register}
        />
      );
    case "number":
      return (
        <NumberInput
          attribute={attribute}
          dispatchDisplayMap={dispatchDisplayMap}
          fillSelected={fillSelected}
          display={display}
          setFillSelected={setFillSelected}
          variant={variant}
          index={index}
          register={register}
        />
      );
    case "routing":
      return (
        <>
          {algorithms && (
            <RoutingInput
              attribute={attribute}
              algorithms={algorithms}
              observedAlgorithm={observedAlgorithm}
              variant={variant}
              display={display}
              dispatchDisplayMap={dispatchDisplayMap}
              index={index}
              register={register}
            />
          )}
        </>
      );
  }

  return <></>;
};

export default Input;
