import React, { createContext, useContext, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import FileLoader from "./components/FileLoader";
import "@fontsource/roboto-mono/700.css";
import Loading from "./components/Loading";

type AppState = {
  processingInput: boolean;
  setProcessingInput: React.Dispatch<React.SetStateAction<boolean>>;
  svg: null;
  setSVG: React.Dispatch<React.SetStateAction<null>>;
};

const AppStateContext = createContext<AppState | null>(null);

function App() {
  const [processingInput, setProcessingInput] = useState(false);
  const [svg, setSVG] = useState(null);

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
        <FileLoader />
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
