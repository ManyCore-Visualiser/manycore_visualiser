import { useRef } from "react";
import { useAppContext } from "../../App";
import {
  CoreRouterConfiguration,
  RoutingConfigT,
} from "../../types/configuration";
import { updateSVG } from "../../utils/loadUtils";
import ElementSettings from "./ElementSettings";
import RoutingSettings from "./RoutingSettings";
import SettingsButton from "./SettingsButton";
import "./checkbox.css";
import "./colour.css";
import "./number.css";
import "./select.css";

const Settings: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const coresRef = useRef<(() => Promise<CoreRouterConfiguration>) | undefined>(
    undefined
  );
  const routersRef = useRef<
    (() => Promise<CoreRouterConfiguration>) | undefined
  >(undefined);
  const routingRef = useRef<(() => Promise<RoutingConfigT>) | undefined>(
    undefined
  );

  return (
    <div
      className={`fixed z-20 bg-black text-white flex flex-col h-screen transition-transform duration-200 ease-in-out justify-between w-96 ${
        ctx.settings ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="overflow-y-scroll no-scrollbar px-2">
        <h3 className="block text-indigo-400 text-2xl">
          Visualisation Settings
        </h3>
        {ctx.attributes && (
          <>
            <ElementSettings
              attributes={ctx.attributes.core}
              promiseRef={coresRef}
              variant="Cores"
            />
            <ElementSettings
              attributes={ctx.attributes.router}
              promiseRef={routersRef}
              variant="Routers"
            />
            <RoutingSettings
              promiseRef={routingRef}
              algorithms={ctx.attributes.algorithms}
              observedAlgorithm={ctx.attributes.observedAlgorithm}
            />
          </>
        )}
      </div>
      <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 px-2 pb-2 pt-4">
        <SettingsButton text="Load new Graph" action={() => {}} fullSize />
        <SettingsButton
          text="Apply"
          action={async () => {
            if (coresRef.current && routersRef.current && routingRef.current) {
              try {
                const coreConfig = await coresRef.current();
                const routerConfig = await routersRef.current();
                const routingConfig = await routingRef.current();
                updateSVG(
                  {
                    coreConfig,
                    routerConfig,
                    ...routingConfig,
                  },
                  ctx.setSVGStyle,
                  ctx.setSVGInformation,
                  ctx.setSVGSinksSources,
                  ctx.setSVGViewbox
                );
              } catch (e) {
                // TODO: Handle error
              }
            } else {
              // TODO: Something went seriously wrong
            }
          }}
        />
        <SettingsButton
          text="Close"
          action={() => {
            ctx.showSettings(false);
          }}
        />
      </div>
    </div>
  );
};

export default Settings;
