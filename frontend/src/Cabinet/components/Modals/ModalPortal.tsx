import { ReactNode } from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }: { children: ReactNode }) => {
  const el = document.getElementById("modal-portal") as HTMLElement;
  return createPortal(children, el);
};

export default ModalPortal;
