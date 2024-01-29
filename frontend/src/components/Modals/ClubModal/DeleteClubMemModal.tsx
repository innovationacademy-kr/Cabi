import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import { modalPropsMap } from "@/assets/data/maps";
import IconType from "@/types/enum/icon.type.enum";
import { axiosDeleteClubMember } from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

const DeleteClubMemModal: React.FC<{
  closeModal: React.MouseEventHandler;
  targetMember: string;
  clubId: number;
  userId: number;
  getClubInfo: (clubId: number) => Promise<void>;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const mandateDetail = `동아리 사물함 멤버에서 ${props.targetMember}을 내보내시겠습니까?`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      //  axios할게 있나..?
      await axiosDeleteClubMember(props.clubId, props.userId);
      // recoil Master 권한 바꾸기

      setIsCurrentSectionRender(true);
      setModalTitle(
        `동아리 사물함 멤버에서 ${props.targetMember}를 내보냈습니다`
      );
      props.getClubInfo(props.clubId);
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_CLUB_DEL_MEM.title,
    detail: mandateDetail,
    proceedBtnText: modalPropsMap.MODAL_CLUB_DEL_MEM.confirmMessage,
    onClickProceed: trySwapRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={swapModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="동아리원 내보내기 실패"
            modalContents={modalContent}
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

export default DeleteClubMemModal;