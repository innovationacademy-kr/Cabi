import {
  axiosCabinetById,
  axiosLentId,
  axiosLentShareId,
  axiosMyLentInfo,
} from "@/Cabinet/api/axios/axios.custom";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { getExpireDateString } from "@/Cabinet/utils/dateUtils";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const LentModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const formattedExpireDate = getExpireDateString(props.lentType);
  const privateLentDetail = `대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.
    귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.
    3주(21일) 이상 연체 시 사물함은 강제 반납되며
    미회수된 개인 물품은 폐기될 수 있습니다.`;
  const shareLentDetail = `<strong>대여 후 ${
    10
    // import.meta.env.VITE_SHARE_LENT_COUNTDOWN // TODO: .env 에 등록하기
  }분 이내에</strong>
  공유 인원 (2인~4인) 이 충족되지 않으면,
  공유 사물함의 대여가 취소됩니다.
  “메모 내용”은 공유 인원끼리 공유됩니다.
  귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.
  3주(21일) 이상 연체 시 사물함은 강제 반납되며
  미회수된 개인 물품은 폐기될 수 있습니다.`;
  const tryLentRequest = async (e: React.MouseEvent) => {
    setIsLoading(true);
    try {
      if (props.lentType == "SHARE")
        await axiosLentShareId(currentCabinetId, "0");
      else await axiosLentId(currentCabinetId);
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      setIsCurrentSectionRender(true);
      if (props.lentType == "SHARE")
        setModalTitle("공유 사물함 대기열에 입장하였습니다");
      else setModalTitle("대여가 완료되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      // 내 대여정보 바꾸는 곳
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const lentModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap[CabinetStatus.AVAILABLE].title,
    detail: props.lentType === "PRIVATE" ? privateLentDetail : shareLentDetail,
    proceedBtnText: modalPropsMap[CabinetStatus.AVAILABLE].confirmMessage,
    onClickProceed: tryLentRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={lentModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={props.closeModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={props.closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default LentModal;
