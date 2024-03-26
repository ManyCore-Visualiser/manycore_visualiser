import "@fontsource/roboto-mono/400.css";
import React, { createContext, useContext, useState } from "react";
import Controls from "./components/Controls";
import FileLoader from "./components/FileLoader";
import Graph from "./components/Graph";
import Loading from "./components/Loading";
import Settings from "./components/Settings";
import { ProcessedAttributesT } from "./types/configuration";
import type { SVGT, SVGUpdateT } from "./types/svg";
import { TransformT } from "./types/transform";
import HoverInfo from "./components/HoverInfo";

export type AppState = {
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: SVGT;
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>;
  svgStyle: SVGUpdateT;
  setSVGStyle: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgInformation: SVGUpdateT;
  setSVGInformation: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgSinksSources: SVGUpdateT;
  setSVGSinksSources: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
  svgViewbox: SVGUpdateT;
  setSVGViewbox: React.Dispatch<React.SetStateAction<SVGUpdateT>>;
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
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState<SVGT>(null);
  const [svgStyle, setSVGStyle] = useState<SVGUpdateT>(null);
  const [svgInformation, setSVGInformation] = useState<SVGUpdateT>(null);
  const [svgSinksSources, setSVGSinksSources] = useState<SVGUpdateT>(null);
  const [svgViewbox, setSVGViewbox] = useState<SVGUpdateT>(null);
  const [aidOpacity, setAidOpacity] = useState(false);
  const [transform, setTransform] = useState<TransformT>(undefined);
  const [settings, showSettings] = useState(false);
  const [attributes, setAttributes] = useState<
    ProcessedAttributesT | undefined
  >(undefined);
  const [editing, setEditing] = useState(false);

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
        editing,
        setEditing
      }}
    >
      <HoverInfo />
      <div className="w-full h-full flex flex-col">
        {(processingInput || editing) && <Loading />}
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
