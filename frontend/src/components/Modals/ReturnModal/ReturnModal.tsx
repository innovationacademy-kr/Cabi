import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosReturn,
} from "@/api/axios/axios.custom";
import { getExpireDateString } from "@/utils/dateUtils";

const ReturnModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
  handleOpenPasswordCheckModal: Function;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const formattedExpireDate = getExpireDateString(
    "myCabinet",
    myLentInfo.lents ? myLentInfo.lents[0].expiredAt : undefined
  );
  const returnDetail = `${
    myLentInfo && myLentInfo.lents[0].expiredAt === null
      ? ""
      : `대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.`
  }
지금 반납 하시겠습니까?`;
  const tryReturnRequest = async (e: React.MouseEvent) => {
    setIsLoading(true);
    try {
      await axiosReturn();
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinetId: null });
      setIsCurrentSectionRender(true);
      setModalTitle("반납되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      //userLentInfo 세팅
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      if (error.response.status === 418) {
        props.closeModal(e);
        props.handleOpenPasswordCheckModal();
        return;
      }
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const returnModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap[additionalModalType.MODAL_RETURN].title,
    detail: returnDetail,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
    onClickProceed: tryReturnRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={returnModalContents} />}
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

export default ReturnModal;
