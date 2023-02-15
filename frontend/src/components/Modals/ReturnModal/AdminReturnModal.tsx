import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { axiosCabinetById, axiosReturn } from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";

const AdminReturnModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const returnDetail = "지금 반납 하시겠습니까?";
  const tryReturnRequest = async (e: React.MouseEvent) => {
    try {
      await axiosReturn();
      //userCabinetId 세팅
      setIsCurrentSectionRender(true);
      setModalTitle("반납되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
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

export default AdminReturnModal;
