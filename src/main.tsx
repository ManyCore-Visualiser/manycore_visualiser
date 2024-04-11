import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{ className: "border-2 border-indigo-500" }}
    />
    <App />
  </React.StrictMode>
);
