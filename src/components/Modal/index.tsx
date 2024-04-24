import { createContext, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./style.css";

type ModalProps = {
  children: JSX.Element | JSX.Element[];
};

type ModalContextT = {
  display: boolean;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ModalContext = createContext<ModalContextT | null>(null);

const Modal: React.FunctionComponent<ModalProps> = ({ children }) => {
  const { display } = useModalContext();
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      if (display) modalRef.current.showModal();
      else modalRef.current.close();
    }
  }, [display]);

  return (
    <>
      {createPortal(
        <dialog ref={modalRef} className="modal">
          {children}
        </dialog>,
        document.body
      )}
    </>
  );
};

export function useModalContext() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error("ModalContext must be used within a provider");
  }

  return ctx;
}

export default Modal;
