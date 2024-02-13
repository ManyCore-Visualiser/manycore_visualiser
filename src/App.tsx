import React, { createContext, useContext, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import FileLoader from "./components/FileLoader";
import "@fontsource/roboto-mono/700.css";
import Loading from "./components/Loading";
import type { SVGT } from "./types/svg";
import Graph from "./components/Graph";

type AppState = {
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: SVGT;
  setSVG: React.Dispatch<React.SetStateAction<SVGT>>;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState<SVGT>(null);

  return (
    <AppStateContext.Provider
      value={{
        processingInput,
        setProcessingInput,
        svg,
        setSVG,
      }}
    >
      <div className="w-full h-full flex flex-col">
        {processingInput && <Loading />}
        {!svg && <FileLoader />}
        {svg && <Graph />}
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
