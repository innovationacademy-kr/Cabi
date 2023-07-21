import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalInterface {
  children: ReactNode;
}

const ModalPortal = ({ children }: ModalPortalInterface) => {
  const el = document.getElementById("modal-portal") as HTMLElement;
  return createPortal(children, el);
};

export default ModalPortal;
