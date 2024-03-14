import "@fontsource/roboto-mono/400.css";
import React, { createContext, useContext, useState } from "react";
import Controls from "./components/Controls";
import FileLoader from "./components/FileLoader";
import Graph from "./components/Graph";
import Loading from "./components/Loading";
import Settings from "./components/Settings";
import { ProcessedAttributesT } from "./types/configuration";
import type { SVGT } from "./types/svg";
import { TransformT } from "./types/transform";
import HoverInfo from "./components/HoverInfo";

export type AppState = {
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: SVGT;
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>;
  svgStyle: SVGT;
  setSVGStyle: React.Dispatch<React.SetStateAction<SVGT>>;
  svgInformation: SVGT;
  setSVGInformation: React.Dispatch<React.SetStateAction<SVGT>>;
  svgSinksSources: SVGT;
  setSVGSinksSources: React.Dispatch<React.SetStateAction<SVGT>>;
  svgViewbox: SVGT;
  setSVGViewbox: React.Dispatch<React.SetStateAction<SVGT>>;
  aidOpacity: boolean;
  setAidOpacity: React.Dispatch<React.SetStateAction<boolean>>;
  transform: TransformT;
  setTransform: React.Dispatch<React.SetStateAction<TransformT>>;
  settings: boolean;
  showSettings: React.Dispatch<React.SetStateAction<boolean>>;
  attributes: ProcessedAttributesT | undefined;
  setAttributes: React.Dispatch<
    React.SetStateAction<ProcessedAttributesT | undefined>
  >;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState<SVGT>(null);
  const [svgStyle, setSVGStyle] = useState<SVGT>(null);
  const [svgInformation, setSVGInformation] = useState<SVGT>(null);
  const [svgSinksSources, setSVGSinksSources] = useState<SVGT>(null);
  const [svgViewbox, setSVGViewbox] = useState<SVGT>(null);
  const [aidOpacity, setAidOpacity] = useState(false);
  const [transform, setTransform] = useState<TransformT>(undefined);
  const [settings, showSettings] = useState(false);
  const [attributes, setAttributes] = useState<
    ProcessedAttributesT | undefined
  >(undefined);

  return (
    <AppStateContext.Provider
      value={{
        processingInput,
        setProcessingInput,
        svg,
        setSVG,
        svgStyle,
        setSVGStyle,
        svgInformation,
        setSVGInformation,
        svgSinksSources,
        setSVGSinksSources,
        svgViewbox,
        setSVGViewbox,
        aidOpacity,
        setAidOpacity,
        transform,
        setTransform,
        settings,
        showSettings,
        attributes,
        setAttributes,
      }}
    >
      <HoverInfo />
      <div className="w-full h-full flex flex-col">
        {processingInput && <Loading />}
        {!svg && <FileLoader />}
        {svg && (
          <>
            <Settings />
            <Graph />
            <Controls />
          </>
        )}
      </div>
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
