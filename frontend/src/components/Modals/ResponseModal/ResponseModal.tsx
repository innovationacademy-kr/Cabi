import React from "react";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import IconType from "@/types/enum/icon.type.enum";

export const SuccessResponseModal: React.FC<{
  modalTitle?: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    iconScaleEffect: true,
    title: props.modalTitle ?? "처리되었습니다",
    closeModal: props.closeModal,
    iconType: IconType.CHECKICON,
  };

  return <Modal modalContents={modalContents} />;
};

export const FailResponseModal: React.FC<{
  modalTitle?: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    title: props.modalTitle ?? "실패했습니다",
    closeModal: props.closeModal,
    iconType: IconType.ERRORICON,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
