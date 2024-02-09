import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import FileLoader from "./components/FileLoader";
import "@fontsource/roboto-mono/700.css";

function App() {
  return (
    <div className="w-full h-full flex flex-col">
      <FileLoader />
    </div>
  );
}

export default App;
