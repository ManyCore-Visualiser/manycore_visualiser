import type {
  ConfigurationVariantsT,
  ProcessedAttributesGroupContentT,
} from "../../../../types/configuration";
import { DisplayMapDispatchActionT } from "../../../../types/displayMap";
import BooleanInput from "./BooleanInput";
import CoordinatesInput from "./CoordinatesInput";
import NumberInput from "./NumberInput";
import RoutingInput from "./RoutingInput";
import TextInput from "./TextInput";

type InputT = {
  attribute: string;
  info: ProcessedAttributesGroupContentT;
  variant: ConfigurationVariantsT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  observedAlgorithm?: string | undefined;
  algorithms?: string[];
};

const Input: React.FunctionComponent<InputT> = ({
  attribute,
  info,
  variant,
  dispatchDisplayMap,
  fillSelected,
  setFillSelected,
  algorithms,
  observedAlgorithm,
}) => {
  switch (info.type) {
    case "boolean":
      return (
        <BooleanInput attribute={attribute} info={info} variant={variant} />
      );
    case "coordinates":
      return (
        <CoordinatesInput attribute={attribute} info={info} variant={variant} />
      );
    case "text":
      return (
        <TextInput
          attribute={attribute}
          dispatchDisplayMap={dispatchDisplayMap}
          fillSelected={fillSelected}
          info={info}
          setFillSelected={setFillSelected}
          variant={variant}
        />
      );
    case "number":
      return (
        <NumberInput
          attribute={attribute}
          dispatchDisplayMap={dispatchDisplayMap}
          fillSelected={fillSelected}
          info={info}
          setFillSelected={setFillSelected}
          variant={variant}
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
              info={info}
              dispatchDisplayMap={dispatchDisplayMap}
            />
          )}
        </>
      );
  }

  return <></>;
};

export default Input;
