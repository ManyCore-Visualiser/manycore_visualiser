import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../App";
import SettingsButton from "./SettingsButton";
import { getSVG } from "../../utils/loadUtils";
import ElementSettings from "./ElementSettings";
import "./checkbox.css"
import "./select.css"
import "./number.css"
import "./colour.css"

const Settings: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const coresRef = useRef<HTMLFormElement>(null);
  const routersRef = useRef<HTMLFormElement>(null);
  const [coreConfig, setCoreConfig] = useState({});
  const [routerConfig, setRouterConfig] = useState({});
  let coreCounter = 0;
  let routerCounter = 0;

  useEffect(() => {
    coreCounter++;
  }, [coreConfig]);

  useEffect(() => {
    routerCounter++;
  }, [routerConfig]);

  useEffect(() => {
    if (coreCounter === routerCounter) {
      getSVG(ctx.setSVG, {
        coreConfig,
        routerConfig,
      });
    }
  }, [coreConfig, routerConfig]);

  return (
    <div
      className={`fixed z-50 bg-black text-white flex flex-col h-screen transition-transform duration-200 ease-in-out justify-between w-96 ${
        ctx.settings ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <h3 className="block text-indigo-400 text-2xl">
          Visualisation Settings
        </h3>
        {ctx.attributes && (
          <>
            <ElementSettings
              attributes={ctx.attributes.core}
              mref={coresRef}
              setConfig={setCoreConfig}
              variant="Cores"
            />
            <ElementSettings
              attributes={ctx.attributes.router}
              mref={routersRef}
              setConfig={setRouterConfig}
              variant="Routers"
            />
          </>
        )}
      </div>
      <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 px-2 pb-2 pt-4">
        <SettingsButton text="Load new Graph" action={() => {}} fullSize />
        <SettingsButton
          text="Apply"
          action={() => {
            if (coresRef.current) {
              coresRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }

            if (routersRef.current) {
              routersRef.current.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
              );
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
