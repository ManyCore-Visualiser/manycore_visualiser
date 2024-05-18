import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import RustEvents from "./components/RustEvents";
import Controls from "./components/Controls";
import FileLoader from "./components/FileLoader";
import Graph from "./components/Graph";
import HoverInfo from "./components/HoverInfo";
import Loading from "./components/Loading";
import { ModalContext } from "./components/Modal";
import Settings from "./components/Settings";
import {
  ConfigurableBaseConfigurationT,
  DispatchFillOverrideGroupT,
  FillOverrideGroupT,
  ProcessedAttributesT,
} from "./types/configuration";
import { Point } from "./types/freeForm";
import type { SVGT, SVGUpdateT } from "./types/svg";
import { getBaseConfiguration } from "./utils/loadUtils";

export type AppState = {
  svgRef: React.MutableRefObject<SVGSVGElement | undefined>;
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: SVGT;
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>;
  svgStyle: SVGUpdateT;
  setSVGStyle: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgInformation: SVGUpdateT;
  setSVGInformation: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgTasks: SVGUpdateT;
  setSVGTasks: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgViewbox: SVGUpdateT;
  setSVGViewbox: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  settings: boolean;
  showSettings: React.Dispatch<React.SetStateAction<boolean>>;
  attributes: ProcessedAttributesT | undefined;
  setAttributes: React.Dispatch<
    React.SetStateAction<ProcessedAttributesT | undefined>
  >;
  configurableBaseConfiguration: ConfigurableBaseConfigurationT | undefined;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  freeForm: boolean;
  setFreeForm: React.Dispatch<React.SetStateAction<boolean>>;
  freeFormPoints: Point[];
  setFreeFormPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  graphParentRef: React.MutableRefObject<HTMLDivElement | null>;
  settingsRef: React.MutableRefObject<HTMLDivElement | null>;
  coreFills: FillOverrideGroupT;
  routerFills: FillOverrideGroupT;
  dispatchCoreFills: React.Dispatch<DispatchFillOverrideGroupT>;
  dispatchRouterFills: React.Dispatch<DispatchFillOverrideGroupT>;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState<SVGT>(null);
  const [svgStyle, setSVGStyle] = useState<SVGUpdateT>(null);
  const [svgInformation, setSVGInformation] = useState<SVGUpdateT>(null);
  const [svgTasks, setSVGTasks] = useState<SVGT>(null);
  const [svgViewbox, setSVGViewbox] = useState<SVGUpdateT>(null);
  const [settings, showSettings] = useState(false);
  const [attributes, setAttributes] = useState<
    ProcessedAttributesT | undefined
  >(undefined);
  const [editing, setEditing] = useState(false);
  const [freeForm, setFreeForm] = useState(false);
  const [freeFormPoints, setFreeFormPoints] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>();
  const graphParentRef = useRef<HTMLDivElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const [configurableBaseConfiguration, setConfigurableBaseConfiguration] =
    useState<ConfigurableBaseConfigurationT>();

  const reduceFill: React.Reducer<
    FillOverrideGroupT,
    DispatchFillOverrideGroupT
  > = (state, action) => {
    const newMap = new Map(state);
    switch (action.type) {
      case "add":
        newMap.set(action.id, action.colour);
        return newMap;
      case "remove":
        newMap.delete(action.id);
        return newMap;
      case "replace":
        return action.map;
    }
  };
  const [coreFills, dispatchCoreFills] = useReducer(reduceFill, new Map());
  const [routerFills, dispatchRouterFills] = useReducer(reduceFill, new Map());
  const [displayFillModal, setDisplayFillModal] = useState<string | null>(null);

  function handleContextMenu(ev: MouseEvent) {
    // Remove below line in dev mode to get dev tools
    ev.preventDefault();
  }

  function handleKeyDown(ev: KeyboardEvent) {
    if (ev.ctrlKey && ev.key === "r") {
      // Block page refresh
      ev.preventDefault();
    }
  }

  // onMount operations
  useEffect(() => {
    // Get base configuration on mount. This is application version specific and won't change
    getBaseConfiguration().then((res) =>
      setConfigurableBaseConfiguration(res.baseConfiguration)
    );

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        svgRef,
        processingInput,
        setProcessingInput,
        svg,
        setSVG,
        svgStyle,
        setSVGStyle,
        svgInformation,
        setSVGInformation,
        svgTasks,
        setSVGTasks,
        svgViewbox,
        setSVGViewbox,
        settings,
        showSettings,
        attributes,
        setAttributes,
        editing,
        setEditing,
        freeForm,
        setFreeForm,
        freeFormPoints,
        setFreeFormPoints,
        graphParentRef,
        configurableBaseConfiguration,
        settingsRef,
        coreFills,
        routerFills,
        dispatchCoreFills,
        dispatchRouterFills,
      }}
    >
      <RustEvents />
      <HoverInfo />
      {(processingInput || editing) && <Loading />}
      {!svg && <FileLoader />}
      {svg && (
        <>
          <Settings />
          <ModalContext.Provider
            value={{
              display: displayFillModal,
              setDisplay: setDisplayFillModal,
            }}
          >
            <Graph />
          </ModalContext.Provider>
          <Controls />
        </>
      )}
    </AppStateContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppStateContext);

  if (!ctx) {
    throw new Error("AppContext must be used within a provider");
  }

  return ctx;
}

export default App;
