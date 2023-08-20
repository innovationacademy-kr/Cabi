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
  axiosMyLentInfo, // axiosExtend,
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
    myLentInfo.lents ? myLentInfo.lents[0].expiredAt : undefined
  );
  const extendDetail = `사물함 연장권 사용 시,
대여 기간이 <strong>${formattedExtendedDate} 23:59</strong>으로
연장됩니다.
연장권 사용은 취소할 수 없습니다.
연장권을 사용하시겠습니까?`;
  const tryExtendRequest = async (e: React.MouseEvent) => {
    try {
      // await axiosExtend(); // TODO: 연장권 api 생성 후 연결해야 함
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
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
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap[additionalModalType.MODAL_EXTENSION].title,
    detail: extendDetail,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_EXTENSION].confirmMessage,
    onClickProceed: tryExtendRequest,
    closeModal: props.onClose,
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
