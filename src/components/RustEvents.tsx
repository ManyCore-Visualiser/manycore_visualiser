import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../App";
import { loadNewSystem } from "../utils/loadUtils";

const RustEvents: React.FunctionComponent = () => {
  const ctx = useAppContext();

  const showError = (message: string) =>
    toast.error(message, { duration: 10000 });

  useEffect(() => {
    // loadNewSystem only calls dispatchers (setters), ano no accessors.
    // The reference of the dispatchers shouldn't change because they are
    // created in the <App /> component, which never re-renders.
    // Old React docs also used to state that state dispatcher identity
    // won't change on re-renders. New docs don't say that.
    // However, https://react.dev/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect
    // clearly shows using a state dispatcher without having it as a dependency.
    const listeners: Promise<UnlistenFn>[] = [];

    // Loading events
    listeners.push(
      listen("load_new_system", () => {
        loadNewSystem(ctx);
      })
    );

    // Messaging events
    listeners.push(
      listen<string>("ok_message", (ev) => {
        toast.success(ev.payload);
      })
    );
    listeners.push(
      listen<string>("error_message", (ev) => {
        showError(ev.payload);
      })
    );

    return () => {
      for (const listener of listeners) {
        listener.then((unlisten) => unlisten());
      }
    };
  }, []);

  return <></>;
};

export default RustEvents;
