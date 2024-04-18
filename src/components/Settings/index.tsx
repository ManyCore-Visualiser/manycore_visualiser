import { useCallback, useReducer, useRef, useState } from "react";
import { useAppContext } from "../../App";
import { DisplayMapDispatchActionT, DisplayMapT } from "../../types/displayMap";
import {
  editSystem,
  openFilePickerDialog,
  updateSVG,
} from "../../utils/loadUtils";
import ElementSettings from "./ElementSettings";
import generateConfig from "./ElementSettings/generateConfig";
import SettingsButton from "./SettingsButton";
import "./checkbox.css";
import "./colour.css";
import "./number.css";
import "./select.css";
import toast from "react-hot-toast";
import BaseSettings from "./BaseSettings";
import generateBaseConfig from "./BaseSettings/generateBaseConfig";

const Settings: React.FunctionComponent = () => {
  const ctx = useAppContext();
  const formRef = useRef<HTMLFormElement>(null);

  const displayReducer: React.Reducer<
    DisplayMapT,
    DisplayMapDispatchActionT
  > = (state, action) => {
    return { ...state, [action.attribute]: action.display };
  };
  const [displayMap, dispatchDisplayMap] = useReducer(displayReducer, {});
  const [coreFillSelected, setCoreFillSelected] = useState<string>();
  const [routerFillSelected, setRouterFillSelected] = useState<string>();

  const handleSubmit = useCallback(
    ((ev) => {
      ev.preventDefault();

      if (
        formRef.current &&
        ctx.attributes &&
        ctx.configurableBaseConfiguration
      ) {
        const baseConfiguration = generateBaseConfig(
          formRef.current,
          "SVG",
          ctx.configurableBaseConfiguration
        );

        const coreConfig = generateConfig(
          formRef.current,
          "Cores",
          ctx.attributes.core,
          displayMap
        );

        const routerConfig = generateConfig(
          formRef.current,
          "Routers",
          ctx.attributes.router,
          displayMap
        );

        const channelConfig = generateConfig(
          formRef.current,
          "Channels",
          ctx.attributes.channel,
          displayMap
        );

        if (
          Object.keys(channelConfig).filter((key) => key != "@borderRouters")
            .length > 2
        ) {
          toast.error(
            "You can only select two channel attributes on top of displaying border routers.",
            { duration: 10000 }
          );

          return;
        }

        updateSVG(
          baseConfiguration,
          {
            coreConfig,
            routerConfig,
            channelConfig,
          },
          ctx
        );
      }
    }) as React.FormEventHandler<HTMLFormElement>,
    [formRef, ctx.attributes, displayMap]
  );

  return (
    <div
      ref={ctx.settingsRef}
      className={`fixed z-20 bg-black text-white flex flex-col h-screen transition-transform duration-200 ease-in-out justify-between w-96 select-none ${
        ctx.settings ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="overflow-y-scroll no-scrollbar px-2">
        <h3 className="block text-indigo-400 text-2xl">
          Visualisation Settings
        </h3>
        <form ref={formRef} onSubmit={handleSubmit}>
          {ctx.configurableBaseConfiguration && (
            <BaseSettings
              variant="SVG"
              configurableBaseConfiguration={ctx.configurableBaseConfiguration}
            />
          )}
          {ctx.attributes && (
            <>
              <ElementSettings
                attributes={ctx.attributes.core}
                variant="Cores"
                dispatchDisplayMap={dispatchDisplayMap}
                fillSelected={coreFillSelected}
                setFillSelected={setCoreFillSelected}
              />
              <ElementSettings
                dispatchDisplayMap={dispatchDisplayMap}
                attributes={ctx.attributes.router}
                variant="Routers"
                fillSelected={routerFillSelected}
                setFillSelected={setRouterFillSelected}
              />
              <ElementSettings
                dispatchDisplayMap={dispatchDisplayMap}
                attributes={ctx.attributes.channel}
                variant="Channels"
                fillSelected={routerFillSelected}
                setFillSelected={setRouterFillSelected}
                algorithms={ctx.attributes.algorithms}
                observedAlgorithm={ctx.attributes.observedAlgorithm}
              />
            </>
          )}
        </form>
      </div>
      <div className="w-full grid grid-cols-2 grid-rows-2 gap-2 px-2 pb-2 pt-4">
        <SettingsButton
          text="Load new system"
          action={() => openFilePickerDialog(ctx)}
        />
        <SettingsButton
          text="Edit system"
          action={() => {
            editSystem(ctx);
          }}
        />
        <SettingsButton
          text="Apply"
          action={() => {
            if (formRef.current) {
              formRef.current.dispatchEvent(
                new Event("submit", { cancelable: false, bubbles: true })
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
