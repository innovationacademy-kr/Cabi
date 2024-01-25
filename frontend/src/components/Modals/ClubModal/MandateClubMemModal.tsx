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
  axiosMandateClubMem,
  axiosMyLentInfo,
  axiosSwapId,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

const MandateClubMemModal: React.FC<{
  //
  lentType: string; // 현재 클릭한 사람 정보
  closeModal: React.MouseEventHandler;
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

  const mandateDetail = `<해당 동아리명>의  동아리장 권한을  <선택한 사람>에게 위임하겠습니까?`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosMandateClubMem(clubid, userid);

      // recoil Master 권한 바꾸기
      // setMyInfo({ ...myInfo, cabinetId: currentCabinetId });

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
