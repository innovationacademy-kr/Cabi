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
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import IconType from "@/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosUseExtension, // axiosExtend, // TODO: 연장권 api 생성 후 연결해야 함
} from "@/api/axios/axios.custom";
import { getExtendedDateString } from "@/utils/dateUtils";

const ExtendModal: React.FC<{
  onClose: () => void;
  cabinetId: Number;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const formattedExtendedDate = getExtendedDateString(
    myLentInfo.lents[0].expiredAt,
    myInfo.lentExtensionResponseDto?.extensionPeriod
  );
  const extendDetail = `사물함 연장권 사용 시,
  대여 기간이 <strong>${formattedExtendedDate} 23:59</strong>으로
  연장됩니다.
  연장권 사용은 취소할 수 없습니다.
  연장권을 사용하시겠습니까?`;
  const extendInfoDetail = `사물함을 대여하시면 연장권 사용이 가능합니다.
연장권은 <strong>${myInfo.lentExtensionResponseDto?.expiredAt} 23:59</strong> 이후 만료됩니다.`;
  const getModalTitle = (cabinetId: number | null) => {
    return cabinetId === null
      ? modalPropsMap[additionalModalType.MODAL_OWN_EXTENSION].title
      : modalPropsMap[additionalModalType.MODAL_USE_EXTENSION].title;
  };
  const getModalDetail = (cabinetId: number | null) => {
    return cabinetId === null ? extendInfoDetail : extendDetail;
  };
  const getModalProceedBtnText = (cabinetId: number | null) => {
    return cabinetId === null
      ? modalPropsMap[additionalModalType.MODAL_OWN_EXTENSION].confirmMessage
      : modalPropsMap[additionalModalType.MODAL_USE_EXTENSION].confirmMessage;
  };
  const tryExtendRequest = async (e: React.MouseEvent) => {
    if (currentCabinetId === 0 || myInfo.cabinetId === null) {
      setHasErrorOnResponse(true);
      setModalTitle("현재 대여중인 사물함이 없습니다.");
      setShowResponseModal(true);
      return;
    }
    try {
      await axiosUseExtension();
      setMyInfo({
        ...myInfo,
        cabinetId: currentCabinetId,
        lentExtensionResponseDto: null,
      });
      setIsCurrentSectionRender(true);
      setModalTitle("연장되었습니다");
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const extendModalContents: IModalContents = {
    type: myInfo.cabinetId === null ? "penaltyBtn" : "hasProceedBtn",
    title: getModalTitle(myInfo.cabinetId),
    detail: getModalDetail(myInfo.cabinetId),
    proceedBtnText: getModalProceedBtnText(myInfo.cabinetId),
    onClickProceed:
      myInfo.cabinetId === null
        ? async (e: React.MouseEvent) => {
            props.onClose();
          }
        : tryExtendRequest,
    closeModal: props.onClose,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={extendModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={props.onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={props.onClose}
          />
        ))}
    </ModalPortal>
  );
};

export default ExtendModal;
