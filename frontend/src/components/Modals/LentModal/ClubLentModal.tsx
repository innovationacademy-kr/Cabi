import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  selectedClubInfoState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/assets/data/maps";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { axiosCabinetById, axiosLentClubUser } from "@/api/axios/axios.custom";

const ClubLentModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const setNumberOfAdminWork = useSetRecoilState(numberOfAdminWorkState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const selectedClubInfo = useRecoilValue(selectedClubInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);

  const tryLentRequest = async (e: React.MouseEvent) => {
    try {
      await axiosLentClubUser(selectedClubInfo!.userId, currentCabinetId!, "");
      setIsCurrentSectionRender(true);
      setNumberOfAdminWork((prev) => prev + 1);
      setModalTitle("대여가 완료되었습니다");
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const ClubLentModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: "동아리 선택",
    detail: "사물함을 대여할 동아리를 선택해주세요.",
    proceedBtnText: modalPropsMap[CabinetType.CLUB].confirmMessage,
    onClickProceed: tryLentRequest,
    closeModal: props.closeModal,
    isClubLentModal: true,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={ClubLentModalContents} />}
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

export default ClubLentModal;
