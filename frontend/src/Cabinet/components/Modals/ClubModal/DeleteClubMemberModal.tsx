import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/Cabinet/recoil/atoms";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import { ClubUserResponseDto } from "@/Cabinet/types/dto/club.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosDeleteClubMember } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const DeleteClubMemberModal: React.FC<{
  closeModal: React.MouseEventHandler;
  clubId: number;
  targetMember: ClubUserResponseDto;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const { closeClubMember } = useMenu();

  const deleteDetail = `동아리에서 <strong>${props.targetMember.userName}</strong> 님을 내보내시겠습니까?`;

  const tryDeleteRequest = async () => {
    setIsLoading(true);
    try {
      await axiosDeleteClubMember(props.clubId, props.targetMember.userId);
      setIsCurrentSectionRender(true);
      setModalTitle(
        `동아리에서 ${props.targetMember.userName}님을 내보냈습니다`
      );
      closeClubMember();
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const DeleteModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_CLUB_DEL_MEM.title,
    detail: deleteDetail,
    proceedBtnText: modalPropsMap.MODAL_CLUB_DEL_MEM.confirmMessage,
    onClickProceed: tryDeleteRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={DeleteModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="동아리원 내보내기에 실패했습니다."
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

export default DeleteClubMemberModal;
