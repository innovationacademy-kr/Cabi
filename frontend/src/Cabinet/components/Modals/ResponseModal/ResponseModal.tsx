import React from "react";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

export const SuccessResponseModal: React.FC<{
  modalTitle?: string;
  modalContents?: string | null;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    iconScaleEffect: true,
    title: props.modalTitle ?? "처리되었습니다",
    detail: props.modalContents ?? "",
    closeModal: props.closeModal,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};

export const FailResponseModal: React.FC<{
  modalTitle?: string;
  modalContents?: string | null;
  urlTitle?: string | null;
  url?: string | null;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    title: props.modalTitle ?? "실패했습니다",
    detail: props.modalContents ?? "",
    closeModal: props.closeModal,
    iconType: IconType.ERRORICON,
    urlTitle: props.urlTitle,
    url: props.url,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
