import { useState } from "react";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosUseItem } from "@/Cabinet/api/axios/axios.custom";

const SectionAlertModal = ({
  currentSectionName,
  setShowSectionAlertModal,
}: {
  currentSectionName: string;
  setShowSectionAlertModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerSectionAlert = async () => {
    setIsLoading(true);
    try {
      console.log("hi");
      // axiosUseItem(ALARM, null, cabinetPlaceId, null);
      // TODO : 아이템별 sku map으로

      //   await axiosSwapId(currentCabinetId);
      //   //userCabinetId 세팅
      //   setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      //   setIsCurrentSectionRender(true);
      //   setModalTitle("이사권 사용에 성공했습니다");
      //   // 캐비닛 상세정보 바꾸는 곳
      //   try {
      //     const { data } = await axiosCabinetById(currentCabinetId);
      //     // view 데이터 받아온다
      //     setTargetCabinetInfo(data);
      //   } catch (error) {
      //     throw error;
      //   }
      //   // 내 대여정보 바꾸는 곳
      //   try {
      //     const { data: myLentInfo } = await axiosMyLentInfo();
      //     //내가 빌리고 있는 사물함 정보를 받아온다
      //     setMyLentInfo(myLentInfo);
      //   } catch (error) {
      //     throw error;
      //   }
      // } catch (error: any) {
      //   // setModalTitle(error.response.data.message);

      //   // setModalContent(error.response.data.message);
      //   // error.response.data.message 로 받아올 내용 임시로 작성
      //   setModalContent(
      //     "현재 이사권을 보유하고 있지 않습니다.\n이사권은 까비상점에서 구매하실 수 있습니다."
      //   );
      //   setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const sectionAlertDetail = `알림등록권을 사용해 
  <strong>${currentSectionName}</strong>에 알림을 등록합니다.
  이 섹션에서 <strong>개인 사물함</strong>이 반납되면
  <strong>프로필 - 내 정보</strong>에 설정된 경로로
  알림을 받으실 수 있습니다.
  알림등록권 사용은 취소되지 않습니다.`;

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
    </ModalPortal>
  );
};

export default SectionAlertModal;
