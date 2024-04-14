import React from "react";
import Modal from "@/Cabinet/components/Modals/Modal";
import { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/Cabinet/assets/data/maps";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

const UnavailableModal: React.FC<{
  status: CabinetStatus | additionalModalType;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    title: modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].title,
    closeModal: props.closeModal,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />;
    </ModalPortal>
  );
};

export default UnavailableModal;
