import React from "react";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";

export const SuccessResponseModal: React.FC<{
  modalTitle?: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    icon: checkIcon,
    iconScaleEffect: true,
    title: props.modalTitle ?? "처리되었습니다",
    closeModal: props.closeModal,
  };

  return <Modal modalContents={modalContents} />;
};

export const FailResponseModal: React.FC<{
  modalTitle?: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    icon: errorIcon,
    title: props.modalTitle ?? "실패했습니다",
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
