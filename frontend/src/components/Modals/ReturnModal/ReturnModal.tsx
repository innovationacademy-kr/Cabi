import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosReturn,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { getExpireDateString } from "@/utils";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";

const ReturnModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
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
    myLentInfo.lent_info ? myLentInfo.lent_info[0].expire_time : undefined
  );
  const returnDetail = `대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.
지금 반납 하시겠습니까?`;
  const tryReturnRequest = async (e: React.MouseEvent) => {
    try {
      await axiosReturn();
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinet_id: -1 });
      setIsCurrentSectionRender(true);
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
      setHasErrorOnResponse(true);
      console.error(error);
    } finally {
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
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={returnModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal closeModal={props.closeModal} />
        ) : (
          <SuccessResponseModal closeModal={props.closeModal} />
        ))}
    </ModalPortal>
  );
};

export default ReturnModal;
