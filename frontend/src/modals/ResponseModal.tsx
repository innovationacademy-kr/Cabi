import React from "react";
import ModalContainer from "@/modals/ModalContainer";
import { IModalContents } from "@/modals/ModalContainer";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ModalPortal from "./ModalPortal";

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

  return <ModalContainer modalContents={modalContents} />;
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
      <ModalContainer modalContents={modalContents} />
    </ModalPortal>
  );
};
