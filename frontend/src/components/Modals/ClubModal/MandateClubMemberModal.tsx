import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import { modalPropsMap } from "@/assets/data/maps";
import { ClubResponseDto, ClubUserResponseDto } from "@/types/dto/club.dto";
import IconType from "@/types/enum/icon.type.enum";
import { axiosMandateClubMember } from "@/api/axios/axios.custom";
import useMenu from "@/hooks/useMenu";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

const MandateClubMemberModal: React.FC<{
  closeModal: React.MouseEventHandler;
  clubId: number;
  targetMember: ClubUserResponseDto;
  clubName: string;
}> = (props) => {
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clubName, setClubName] = useState<string>(props.clubName || "");
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const { closeClubMember } = useMenu();

  const mandateDetail = `<strong>${clubName}</strong>의  동아리장 권한을
  <strong>${props.targetMember.userName}</strong> 님에게 위임하겠습니까?`;

  useEffect(() => {
    if (props.clubName) setClubName(props.clubName);
  }, [props.clubName]);

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosMandateClubMember(props.clubId, props.targetMember.userName);
      setIsCurrentSectionRender(true);
      setModalTitle("동아리장 권한을 위임하였습니다.");
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
