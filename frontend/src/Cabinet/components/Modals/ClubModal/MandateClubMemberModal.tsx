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
import { axiosMandateClubMember } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";

const MandateClubMemberModal: React.FC<{
  closeModal: React.MouseEventHandler;
  clubId: number;
  targetMember: ClubUserResponseDto;
}> = (props) => {
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const { closeClubMember } = useMenu();

  const mandateDetail = `동아리장 권한을 <strong>${props.targetMember.userName}</strong> 님에게
  위임하겠습니까?`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosMandateClubMember(props.clubId, props.targetMember.userName);
      setIsCurrentSectionRender(true);
      setModalTitle(`동아리장 권한을 ${props.targetMember.userName}님에게
      위임했습니다`);
      closeClubMember();
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const mandateModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_CLUB_MANDATE_MEM.title,
    detail: mandateDetail,
    proceedBtnText: modalPropsMap.MODAL_CLUB_MANDATE_MEM.confirmMessage,
    onClickProceed: trySwapRequest,
    closeModal: props.closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={mandateModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="동아리장 권한 위임 실패"
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

export default MandateClubMemberModal;
