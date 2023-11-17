import React from "react";
import Modal from "@/components/Modals/Modal";
import { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import IconType from "@/types/enum/icon.type.enum";

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
