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
  axiosLentId,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "../Modal";
import ModalPortal from "../ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../ResponseModal/ResponseModal";

const SwapModal: React.FC<{
  lentType: string; // 현재 클릭한 사물함 종류
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const swapDetail = `사물함 위치가  <strong>${myLentInfo.floor}층 ${myLentInfo.section} ${myLentInfo.visibleNum}번</strong>에서
  <strong>${targetCabinetInfo.floor}층 ${targetCabinetInfo.section} ${targetCabinetInfo.visibleNum}번</strong>로 변경됩니다.
  대여 기간은 그대로 유지되며,
  이사는 취소할 수 없습니다.`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosLentId(currentCabinetId);
      //TODO : swap api 만들고 나서 대체
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      setIsCurrentSectionRender(true);
      setModalTitle("이사가 완료되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      // 내 대여정보 바꾸는 곳
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        //TODO
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_SWAP.title,
    detail: swapDetail,
    proceedBtnText: modalPropsMap.MODAL_SWAP.confirmMessage,
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

export default SwapModal;
