import React, { useEffect, useState } from "react";
import Modal from "@/Cabinet/components/Modals/Modal";
import { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/Cabinet/assets/data/maps";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { formatDate, formatDateTime } from "@/Cabinet/utils/dateUtils";

const OverduePenaltyModal: React.FC<{
  status: CabinetStatus | additionalModalType;
  closeModal: React.MouseEventHandler;
  unbannedAt: Date | null;
  hasPenaltyItem: boolean;
}> = (props) => {
  const unbannedAtDate = props.unbannedAt ? new Date(props.unbannedAt) : null;
  const hasPenaltyItem = props.hasPenaltyItem;

  const penaltyDateDetailStore = hasPenaltyItem
    ? `페널티 기간은 <strong>${formatDate(
        unbannedAtDate,
        "/",
        4,
        2,
        2
      )} ${formatDateTime(unbannedAtDate, ":")}</strong> 까지 입니다. 
      해당 기간까지 대여를 하실 수 없습니다.
      <strong>페널티 감면권</strong>은 <strong>프로필 페이지 - 대여정보</strong> 에서
      사용하실 수 있습니다`
    : `페널티 기간은 <strong>${formatDate(
        unbannedAtDate,
        "/",
        4,
        2,
        2
      )} ${formatDateTime(unbannedAtDate, ":")}</strong> 까지 입니다.
      해당 기간까지 대여를 하실 수 없습니다.
      <strong>페널티 감면권</strong>은 <strong>까비 상점</strong> 에서 구매하실수 있습니다`;
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
    title: modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].title,
    detail: penaltyDateDetailStore,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_OVERDUE_PENALTY].confirmMessage,
    onClickProceed: hideForOneDay,
    closeModal: props.closeModal,
    iconType: IconType.ERRORICON,
    urlTitle: hasPenaltyItem ? "프로필로 이동" : "까비상점으로 이동 ",
    url: hasPenaltyItem ? "profile" : "store",
  };

  return (
    <ModalPortal>
      {isModalOpen && <Modal modalContents={modalContents} />}
    </ModalPortal>
  );
};

export default OverduePenaltyModal;
