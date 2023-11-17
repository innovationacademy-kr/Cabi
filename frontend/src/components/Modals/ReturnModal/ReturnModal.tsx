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
import { getDefaultCabinetInfo } from "@/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import IconType from "@/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosReturn,
} from "@/api/axios/axios.custom";
import {
  getExpireDateString,
  getShortenedExpireDateString,
} from "@/utils/dateUtils";

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
  console.log(myLentInfo);
  console.log();
  const formattedExpireDate = getExpireDateString(
    "myCabinet",
    myLentInfo.lents.length ? myLentInfo.lents[0].expiredAt : undefined
  );
  const shortenedExpireDateString = getShortenedExpireDateString(
    myLentInfo.lentType,
    myLentInfo.lents.length ? myLentInfo.lents.length : 0,
    myLentInfo.lents.length ? myLentInfo.lents[0].expiredAt : undefined
  );
  const returnDetail = `${
    myLentInfo &&
    myLentInfo.lents.length &&
    myLentInfo.lents[0].expiredAt === null
      ? ""
      : myLentInfo.lentType === "SHARE" && myLentInfo.lents.length > 1
      ? `대여기간 이내 취소(반납) 시,
대여 기간이 <strong>${shortenedExpireDateString} 23:59</strong>으로
변경되는 패널티가 발생합니다.`
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
        if (myLentInfo) {
          setMyLentInfo(myLentInfo);
        } else {
          setMyLentInfo({
            ...getDefaultCabinetInfo(),
            memo: "",
            shareCode: 0,
            previousUserName: "",
          });
        }
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
    title: modalPropsMap[additionalModalType.MODAL_RETURN].title,
    detail: returnDetail,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
    onClickProceed: tryReturnRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
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
