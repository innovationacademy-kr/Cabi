import React from "react";
import Modal from "@/components/Modals/Modal";
import { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import errorIcon from "@/assets/images/errorIcon.svg";
import CabinetStatus from "@/types/enum/cabinet.status.enum";

const UnavailableModal: React.FC<{
  status: CabinetStatus | additionalModalType;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    icon: errorIcon,
    title: modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].title,
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />;
    </ModalPortal>
  );
};

export default UnavailableModal;
