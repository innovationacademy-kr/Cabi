import React from "react";
import Modal from "@/components/Modals/Modal";
import { IModalContents } from "@/components/Modals/Modal";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ModalPortal from "@/components/Modals/ModalPortal";

export const SuccessResponseModal: React.FC<{
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    icon: checkIcon,
    iconScaleEffect: true,
    title: "처리되었습니다!",
    closeModal: props.closeModal,
  };

  return <Modal modalContents={modalContents} />;
};

export const FailResponseModal: React.FC<{
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    icon: errorIcon,
    title: "실패했습니다",
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
