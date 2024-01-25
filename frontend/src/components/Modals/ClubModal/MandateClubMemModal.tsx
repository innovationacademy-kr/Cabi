import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import { modalPropsMap } from "@/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import IconType from "@/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMandateClubMember,
  axiosMyLentInfo,
  axiosSwapId,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

// 필요한 Param
// 현재 소속된 clubId
// 권한을 위임하려고 하는 동아리원 이름

const MandateClubMemModal: React.FC<{
  closeModal: React.MouseEventHandler;
  clubId: number;
  mandateMember: string;
  // lentType: string;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const currentClubId = useRecoilValue(currentCabinetIdState);

  // 클럽 마스터 Id정보
  // const [myInfo, setMyInfo] = useRecoilState(userState);
  const [targetClubMember, setTargetClubMember] = useRecoilState(userState);

  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const mandateDetail = `<해당 동아리명>의  동아리장 권한을  ${props.mandateMember}에게 위임하겠습니까?`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosMandateClubMember(props.clubId, props.mandateMember);
      setIsCurrentSectionRender(true);
      setModalTitle("동아리장 권한을 위임하였습니다.");
    } catch (error: any) {
      // setModalTitle(error.response.data.message);
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
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
      {!showResponseModal && <Modal modalContents={swapModalContents} />}
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

export default MandateClubMemModal;
