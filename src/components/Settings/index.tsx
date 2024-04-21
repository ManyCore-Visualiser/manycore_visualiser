import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useReducer, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAppContext } from "../../App";
import {
  AttributeTypeT,
  ConfigurableBaseConfigurationTypes,
  ConfigurationVariantsT,
} from "../../types/configuration";
import { DisplayMapDispatchActionT, DisplayMapT } from "../../types/displayMap";
import { editSystem, loadNewSystem, updateSVG } from "../../utils/loadUtils";
import BaseSettings from "./BaseSettings";
import addToBaseSettings from "./BaseSettings/utils/addToBaseSettings";
import ElementSettings from "./ElementSettings";
import addToElementSettings from "./ElementSettings/utils/addToElementSettings";
import SettingsButton from "./SettingsButton";
import "./checkbox.css";
import "./colour.css";
import "./number.css";
import "./select.css";
import generateConfiguration from "./utils/generateConfiguration";

export type FieldT = {
  attribute: string;
  display: string;
  type: AttributeTypeT | ConfigurableBaseConfigurationTypes;
} & Record<string, string | number | boolean>;

export type FormValues = {
  [key in ConfigurationVariantsT]: FieldT[];
};

export type FieldNameT = `${ConfigurationVariantsT}.${number}.${string}`;

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

  const onSubmit = (data: FormValues) => {
    if (ctx.attributes && ctx.configurableBaseConfiguration) {
      const configuration = generateConfiguration(
        data,
        displayMap,
        ctx.attributes,
        ctx.configurableBaseConfiguration
      );

      if (configuration) {
        updateSVG(
          configuration.baseConfiguration,
          configuration.configuration,
          ctx
        );
      }
    }
  };

  // Listen to configuration import/export events
  useEffect(() => {
    // const importListener = listen<string>("load_config", (ev) => {
    //   if (formRef.current) {
    //     const wholeConfiguration = JSON.parse(
    //       ev.payload
    //     ) as WholeConfigurationT;
    //     populateFromConfiguration(
    //       formRef.current,
    //       wholeConfiguration,
    //       dispatchDisplayMap,
    //       "SVG",
    //       "Cores",
    //       "Routers",
    //       "Channels"
    //     );
    //   }
    // });

    const exportListener = listen("export_config", () => {
      if (formRef.current) {
        if (
          formRef.current &&
          ctx.attributes &&
          ctx.configurableBaseConfiguration
        ) {
          const wholeConfiguration = generateConfiguration(
            getValues(),
            displayMap,
            ctx.attributes,
            ctx.configurableBaseConfiguration
          );
          if (wholeConfiguration)
            invoke("store_configuration", {
              wholeConfiguration: JSON.stringify(wholeConfiguration),
            });
        }
      }
    });

    return () => {
      // importListener.then((unlisten) => unlisten());
      exportListener.then((unlisten) => unlisten());
    };
  }, [ctx.attributes, ctx.configurableBaseConfiguration, displayMap]);

  const { register, handleSubmit, control, getValues } = useForm<FormValues>();
  const svgArray = useFieldArray({
    name: "SVG" as ConfigurationVariantsT,
    control,
  });
  const coreArray = useFieldArray({
    name: "Cores" as ConfigurationVariantsT,
    control,
  });
  const routerArray = useFieldArray({
    name: "Routers" as ConfigurationVariantsT,
    control,
  });
  const channelArray = useFieldArray({
    name: "Channels" as ConfigurationVariantsT,
    control,
  });

  useEffect(() => {
    if (ctx.attributes && ctx.configurableBaseConfiguration) {
      const values = getValues();

      addToElementSettings(ctx.attributes.core, coreArray, values.Cores);
      addToElementSettings(ctx.attributes.router, routerArray, values.Routers);
      addToElementSettings(
        ctx.attributes.channel,
        channelArray,
        values.Channels
      );
    }
  }, [ctx.attributes]);

  useEffect(() => {
    if (ctx.configurableBaseConfiguration)
      addToBaseSettings(ctx.configurableBaseConfiguration, svgArray);
  }, [ctx.configurableBaseConfiguration]);

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
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          {ctx.configurableBaseConfiguration && (
            <BaseSettings
              variant="SVG"
              configurableBaseConfiguration={ctx.configurableBaseConfiguration}
              register={register}
              fieldsArray={svgArray}
            />
          )}
          {ctx.attributes && (
            <>
              <ElementSettings
                variant="Cores"
                dispatchDisplayMap={dispatchDisplayMap}
                fillSelected={coreFillSelected}
                setFillSelected={setCoreFillSelected}
                register={register}
                fieldsArray={coreArray}
              />
              <ElementSettings
                dispatchDisplayMap={dispatchDisplayMap}
                variant="Routers"
                fillSelected={routerFillSelected}
                setFillSelected={setRouterFillSelected}
                register={register}
                fieldsArray={routerArray}
              />
              <ElementSettings
                dispatchDisplayMap={dispatchDisplayMap}
                variant="Channels"
                fillSelected={routerFillSelected}
                setFillSelected={setRouterFillSelected}
                algorithms={ctx.attributes.algorithms}
                observedAlgorithm={ctx.attributes.observedAlgorithm}
                register={register}
                fieldsArray={channelArray}
              />
            </>
          )}
        </form>
      </div>
      <div className="w-full grid grid-cols-2 grid-rows-3 gap-2 px-2 pb-2 pt-4">
        <SettingsButton
          text="Load new system"
          action={() => loadNewSystem(ctx)}
        />
        <SettingsButton
          text="Edit system"
          action={() => {
            editSystem(ctx);
          }}
        />
        <SettingsButton text="Export Configuration" action={() => {}} />
        <SettingsButton text="Load Configuration" action={() => {}} />
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
