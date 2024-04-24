import { useAppContext } from "../../../../App";
import Close from "../../../icons/Close";

type FillOverridesProps = {
  variant: "Cores" | "Routers";
};

const FillOverrides: React.FunctionComponent<FillOverridesProps> = ({
  variant,
}) => {
  const { routerFills, coreFills, dispatchCoreFills, dispatchRouterFills } =
    useAppContext();
  const [map, dispatch] =
    variant === "Cores"
      ? [coreFills, dispatchCoreFills]
      : [routerFills, dispatchRouterFills];

  // Exclude s in display
  const displayVariant = variant.slice(0, variant.length - 1);
  return (
    <>
      {map.size > 0 && (
        <div className="flex flex-col mt-10">
          <span className="text-indigo-500 w-full text-2xl border-b-2 border-indigo-500">
            <h4>{variant} fill overrides</h4>
          </span>
          {[...map.entries()].map(([index, colour]) => (
            <div className="flex items-center py-2 text-lg" key={index}>
              <label htmlFor="core-fill-colour">
                {displayVariant} {index}:
              </label>
              <input
                id="core-fill-colour"
                type="color"
                className="colour-button"
                value={colour}
                onChange={(ev) => {
                  dispatch({ type: "add", id: index, colour: ev.target.value });
                }}
              ></input>
              <button
                onClick={() => {
                  dispatch({ type: "remove", id: index });
                }}
                type="button"
              >
                <Close width="1.5em" height="1.5em" className="ml-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FillOverrides;
