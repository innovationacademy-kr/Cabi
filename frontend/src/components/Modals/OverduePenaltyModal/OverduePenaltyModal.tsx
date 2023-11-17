import React, { useEffect, useState } from "react";
import Modal from "@/components/Modals/Modal";
import { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import errorIcon from "@/assets/images/errorIcon.svg";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import { formatDate } from "@/utils/dateUtils";

const OverduePenaltyModal: React.FC<{
  status: CabinetStatus | additionalModalType;
  closeModal: React.MouseEventHandler;
  unbannedAt: Date | null;
}> = (props) => {
  const unbannedAtDate = props.unbannedAt ? new Date(props.unbannedAt) : null;

  const penaltyDateDetail = `패널티 기간은 <strong> ${formatDate(
    unbannedAtDate,
    "/"
  )} 23:59</strong> 까지 입니다.
    해당 기간까지 대여를 하실 수 없습니다.`;
  const localStorageKey = "hideOverdueModalForOneDay";

  const showModal = (): React.ReactNode => {
    const hideUntil = localStorage.getItem(localStorageKey);
    if (!hideUntil || new Date() > new Date(hideUntil)) {
      setIsModalOpen(true);
      return <></>;
    }
    return null;
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const hideForOneDay = async (e: React.MouseEvent) => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    localStorage.setItem("hideOverdueModalForOneDay", now.toString());
    closeModal();
  };

  useEffect(() => {
    showModal();
  }, []);

  const modalContents: IModalContents = {
    type: "penaltyBtn",
    icon: errorIcon,
    title: modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].title,
    detail: penaltyDateDetail,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].confirmMessage,
    onClickProceed: hideForOneDay,
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      {isModalOpen && <Modal modalContents={modalContents} />}
    </ModalPortal>
  );
};

export default OverduePenaltyModal;
