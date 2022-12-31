import ModalContainer from "@/containers/ModalContainer";
import { ModalInterface } from "@/containers/ModalContainer";
import { MouseEventHandler } from "react";

const Modal = (props: {
  modalObj: ModalInterface;
  onClose: MouseEventHandler;
}) => {
  return <ModalContainer {...props} />;
};

export default Modal;
