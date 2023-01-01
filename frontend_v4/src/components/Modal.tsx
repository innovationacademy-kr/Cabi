import ModalContainer from "@/containers/ModalContainer";
import { ModalInterface } from "@/containers/ModalContainer";

const Modal = (props: {
  modalObj: ModalInterface;
  onClose: React.MouseEventHandler;
}) => {
  return <ModalContainer {...props} />;
};

export default Modal;
