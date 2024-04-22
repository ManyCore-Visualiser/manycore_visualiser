import type {
  AttributeTypeT,
  ConfigurationVariantsT,
} from "../../../../types/configuration";
import BooleanInput from "./BooleanInput";
import CoordinatesInput from "./CoordinatesInput";
import NumberInput from "./NumberInput";
import RoutingInput from "./RoutingInput";
import TextInput from "./TextInput";

type InputT = {
  attribute: string;
  variant: ConfigurationVariantsT;
  fillSelected: string | undefined;
  setFillSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  index: number;
  type: AttributeTypeT;
  display: string;
};

const Input: React.FunctionComponent<InputT> = ({
  attribute,
  variant,
  fillSelected,
  setFillSelected,
  index,
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
        />
      );
    case "coordinates":
      return (
        <CoordinatesInput
          attribute={attribute}
          display={display}
          variant={variant}
          index={index}
        />
      );
    case "text":
      return (
        <TextInput
          attribute={attribute}
          fillSelected={fillSelected}
          display={display}
          setFillSelected={setFillSelected}
          variant={variant}
          index={index}
        />
      );
    case "number":
      return (
        <NumberInput
          attribute={attribute}
          fillSelected={fillSelected}
          display={display}
          setFillSelected={setFillSelected}
          variant={variant}
          index={index}
        />
      );
    case "routing":
      return (
        <>
          <RoutingInput
            attribute={attribute}
            variant={variant}
            display={display}
            index={index}
          />
        </>
      );
  }

  return <></>;
};

export default Input;
