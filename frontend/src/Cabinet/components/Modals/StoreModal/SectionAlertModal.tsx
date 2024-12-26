import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/Cabinet/recoil/atoms";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosUseItem } from "@/Cabinet/api/axios/axios.custom";
import { HttpStatusCode } from "axios";

const SectionAlertModal = ({
  currentSectionName,
  setShowSectionAlertModal,
  currentBuilding,
  currentFloor,
}: {
  currentSectionName: string;
  setShowSectionAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentBuilding: string;
  currentFloor: number;
}) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const sectionAlertDetail = `
  <strong>${currentSectionName}</strong>에 알림을 등록합니다.
  이 섹션에서 <strong>개인 사물함</strong>이 반납되면
  <strong>프로필 - 내 정보에 설정된 경로로
  알림을 받으실 수 있습니다.</strong>
  알림등록권 사용은 취소되지 않습니다.`;

  const registerSectionAlert = async () => {
    setIsLoading(true);
    try {
      await axiosUseItem(
        "ALARM",
        null,
        currentBuilding,
        currentFloor,
        currentSectionName
      );
      setIsCurrentSectionRender(true);
      // TODO : 아이템별 sku map으로
      setModalTitle("알림 등록권 사용완료");
    } catch (error: any) {
      setHasErrorOnResponse(true);
      if (error.response.status === HttpStatusCode.BadRequest) {
        setModalTitle("알림 등록권 사용실패");
        setModalContent(`현재 알림 등록권을 보유하고 있지 않습니다.
알림 등록권은 까비 상점에서 구매하실 수 있습니다.`);
      } else {
        if (error.response) {
          setModalTitle(error.response.data.message);
          setModalContent(error.response.data.message);
        }
        setModalTitle(error.data.message);
      }
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const closeModal = () => {
    setShowSectionAlertModal(false);
  };

  const sectionAlertModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_SECTION_ALERT.title,
    detail: sectionAlertDetail,
    proceedBtnText: modalPropsMap.MODAL_STORE_SWAP.confirmMessage,
    onClickProceed: registerSectionAlert,
    closeModal: closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
    url: "/profile",
    urlTitle: "프로필으로 이동",
  };

  return (
    <ModalPortal>
      {!showResponseModal && (
        <Modal modalContents={sectionAlertModalContents} />
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={closeModal}
            url={"/store"}
            urlTitle={"까비상점으로 이동"}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default SectionAlertModal;
