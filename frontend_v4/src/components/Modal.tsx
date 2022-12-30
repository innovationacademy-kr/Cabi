import ModalContainer from "@/containers/ModalContainer";

interface ModalProps {
  type: string;
  title: string | null;
  detail: string | null;
  confirmMessage: string;
}

export const Modal = (props: ModalProps) => {
  return <ModalContainer {...props} />;
};
