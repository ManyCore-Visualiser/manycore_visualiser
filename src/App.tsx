import "@fontsource/roboto-mono/700.css";
import React, { createContext, useContext, useState } from "react";
import Controls from "./components/Controls";
import FileLoader from "./components/FileLoader";
import Graph from "./components/Graph";
import Loading from "./components/Loading";
import type { SVGT } from "./types/svg";

type AppState = {
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: SVGT;
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>;
  aidOpacity: boolean;
  setAidOpacity: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState<SVGT>(null);
  const [aidOpacity, setAidOpacity] = useState(false);

  return (
    <AppStateContext.Provider
      value={{
        processingInput,
        setProcessingInput,
        svg,
        setSVG,
        aidOpacity,
        setAidOpacity,
      }}
    >
      <div className="w-full h-full flex flex-col">
        {processingInput && <Loading />}
        {!svg && <FileLoader />}
        {svg && (
          <>
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
