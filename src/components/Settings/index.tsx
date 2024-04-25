import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppContext } from "../../App";
import {
  AttributeTypeT,
  ConfigurableBaseConfigurationTypes,
  ConfigurationVariantsT,
  WholeConfigurationT,
} from "../../types/configuration";
import { DisplayMapDispatchActionT, DisplayMapT } from "../../types/displayMap";
import { editSystem, updateSVG } from "../../utils/loadUtils";
import { ModalContext } from "../Modal";
import BaseSettings from "./BaseSettings";
import addToBaseSettings from "./BaseSettings/utils/addToBaseSettings";
import DisplayModal, {
  DisplayModalContext,
  DisplayModalContextDataT,
} from "./DisplayModal";
import ElementSettings from "./ElementSettings";
import addToElementSettings from "./ElementSettings/utils/addToElementSettings";
import SettingsButton from "./SettingsButton";
import "./checkbox.css";
import "./colour.css";
import "./mask.css";
import "./number.css";
import "./select.css";
import generateConfiguration from "./utils/generateConfiguration";
import populateFromConfiguration from "./utils/populateFromConfiguration";

export type FieldT = {
  attribute: string;
  display: string;
  type: AttributeTypeT | ConfigurableBaseConfigurationTypes;
} & Record<string, string | number | boolean>;

export type FormValues = {
  [key in ConfigurationVariantsT]: FieldT[];
};

export type FieldNameT = `${ConfigurationVariantsT}.${number}.${string}`;

type SettingsContext = {
  displayMap: DisplayMapT;
  dispatchDisplayMap: React.Dispatch<DisplayMapDispatchActionT>;
};

const SettingsContext = createContext<SettingsContext | null>(null);

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
  const [displayModal, setDisplayModal] = useState<string | null>(null);
  const [displayModalData, setDisplayModalData] =
    useState<DisplayModalContextDataT>({});

  const [coreFillSelected, setCoreFillSelected] = useState<string>();
  const [routerFillSelected, setRouterFillSelected] = useState<string>();

  const onSubmit = (data: FormValues) => {
    if (ctx.attributes && ctx.configurableBaseConfiguration) {
      const configuration = generateConfiguration(
        data,
        displayMap,
        ctx.configurableBaseConfiguration,
        ctx.coreFills,
        ctx.routerFills
      );

      console.log(configuration);

      if (configuration) {
        updateSVG(
          configuration.baseConfiguration,
          configuration.configuration,
          ctx
        );
      }
    }
  };

  const formMethods = useForm<FormValues>();
  const { control, getValues, handleSubmit, setValue } = formMethods;

  // Listen to configuration import/export events
  useEffect(() => {
    // We use getValues here to get a snapshot of the current form state.
    // We don't use the actual field arrays because we'd need to track them
    // as dependencies and that would cause an infinite loop since we progressively
    // update the array content.
    // By getting the current values we can check what's currently in the form
    // and update accordingly to the supplied configuration without
    // scheduling endless re-rendering.
    // This pretty much applies to using getValues across all useEffects in this
    // component. It doesn't look very elegant. However, these are
    // side effects. I don't really see a way to derive state in these conditions.
    // The data is highly variable as it could literally be anything the app supports.
    // We have no ordering guarantees, e.g. a user might shift position of attributes
    // by changing their lexicographic order/adding/removing attributes etc.
    // Detailed level of control and processing is needed here. Regardless,
    // it performs well and everything is pure as per React requirements.
    const importListener = listen<string>("load_config", (ev) => {
      const wholeConfiguration = JSON.parse(ev.payload) as WholeConfigurationT;

      populateFromConfiguration(
        wholeConfiguration,
        getValues(),
        setValue,
        dispatchDisplayMap,
        ctx.dispatchCoreFills,
        ctx.dispatchRouterFills
      );

      toast.success("Successfully loaded configuration");
    });

    return () => {
      importListener.then((unlisten) => unlisten());
    };
  }, [
    dispatchDisplayMap,
    getValues,
    setValue,
    ctx.dispatchCoreFills,
    ctx.dispatchRouterFills,
  ]);

  useEffect(() => {
    const exportListener = listen("export_config", () => {
      if (ctx.configurableBaseConfiguration) {
        const wholeConfiguration = generateConfiguration(
          getValues(),
          displayMap,
          ctx.configurableBaseConfiguration,
          ctx.coreFills,
          ctx.routerFills
        );
        console.log(wholeConfiguration);
        if (wholeConfiguration)
          invoke("store_configuration", {
            wholeConfiguration: JSON.stringify(wholeConfiguration),
          });
      }
    });

    return () => {
      exportListener.then((unlisten) => unlisten());
    };
  }, [
    ctx.configurableBaseConfiguration,
    getValues,
    displayMap,
    ctx.routerFills,
    ctx.coreFills,
  ]);

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

  // In the below effects we don't track the arrays because we don't check
  // the actual data, we only acces methods: insert/update/remove/replace.
  // These methods are derived from the form control. The array reference
  // changes on re-renders because it's just a wrapper around useForm.
  useEffect(() => {
    if (ctx.attributes) {
      const values = getValues();

      addToElementSettings(ctx.attributes.core, coreArray, values.Cores);
      addToElementSettings(ctx.attributes.router, routerArray, values.Routers);
      addToElementSettings(
        ctx.attributes.channel,
        channelArray,
        values.Channels
      );
    }
  }, [ctx.attributes, getValues, control]);

  useEffect(() => {
    if (ctx.configurableBaseConfiguration)
      addToBaseSettings(ctx.configurableBaseConfiguration, svgArray);
  }, [ctx.configurableBaseConfiguration, control]);

  return (
    <SettingsContext.Provider value={{ displayMap, dispatchDisplayMap }}>
      <ModalContext.Provider
        value={{ display: displayModal, setDisplay: setDisplayModal }}
      >
        <DisplayModalContext.Provider
          value={{ data: displayModalData, setData: setDisplayModalData }}
        >
          <div
            ref={ctx.settingsRef}
            className={`fixed z-20 bg-black text-white flex flex-col h-screen transition-transform duration-200 ease-in-out justify-between w-96 select-none ${
              ctx.settings ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <h3 className="block text-indigo-400 text-4xl mx-2 border-b-2 border-b-indigo-700 font-bold">
              Visualisation Settings
            </h3>
            <div className="overflow-y-scroll no-scrollbar bg-gradient-to-b from-transparent from-90% to-indigo-700">
              <div className="px-2 h-full overflow-y-scroll no-scrollbar mask-settings">
                <FormProvider {...formMethods}>
                  <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    {ctx.configurableBaseConfiguration && (
                      <BaseSettings
                        variant="SVG"
                        configurableBaseConfiguration={
                          ctx.configurableBaseConfiguration
                        }
                        fieldsArray={svgArray}
                      />
                    )}
                    {ctx.attributes && (
                      <>
                        <ElementSettings
                          variant="Cores"
                          fillSelected={coreFillSelected}
                          setFillSelected={setCoreFillSelected}
                          fieldsArray={coreArray}
                        />
                        <ElementSettings
                          variant="Routers"
                          fillSelected={routerFillSelected}
                          setFillSelected={setRouterFillSelected}
                          fieldsArray={routerArray}
                        />
                        <ElementSettings
                          variant="Channels"
                          fillSelected={routerFillSelected}
                          setFillSelected={setRouterFillSelected}
                          fieldsArray={channelArray}
                        />
                      </>
                    )}
                  </form>
                </FormProvider>
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col gap-2 px-2 py-2 border-t-2 border-t-indigo-700">
                <SettingsButton
                  text="Edit system"
                  action={() => {
                    editSystem(ctx);
                  }}
                />
                <div className="flex flex-row gap-2">
                  <SettingsButton
                    text="Apply"
                    action={() => {
                      if (formRef.current) {
                        formRef.current.dispatchEvent(
                          new Event("submit", {
                            cancelable: false,
                            bubbles: true,
                          })
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
            </div>
          </div>
          <DisplayModal />
        </DisplayModalContext.Provider>
      </ModalContext.Provider>
    </SettingsContext.Provider>
  );
};

export default Settings;

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error("SettingsContext must be used within a provider");
  }

  return ctx;
}
