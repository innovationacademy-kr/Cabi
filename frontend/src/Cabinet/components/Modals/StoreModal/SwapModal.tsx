import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosUseItem,
} from "@/Cabinet/api/axios/axios.custom";
import { HttpStatusCode } from "axios";

const SwapModal: React.FC<{
  lentType: string; // 현재 클릭한 사물함 종류
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
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
  이사권 사용은 취소할 수 없습니다.`;

  const trySwapRequest = async () => {
    setIsLoading(true);
    try {
      await axiosUseItem("SWAP", currentCabinetId, null, null, null);

      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      setIsCurrentSectionRender(true);
      setModalTitle("이사권 사용완료");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        // view 데이터 받아온다
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      // 내 대여정보 바꾸는 곳
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        //내가 빌리고 있는 사물함 정보를 받아온다
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setModalTitle("이사권 사용실패");
      if (error.response.status === HttpStatusCode.BadRequest) {
        setModalContent(
          "현재 이사권을 보유하고 있지 않습니다.\n이사권은 까비상점에서 구매하실 수 있습니다."
        );
      } else {
        setModalContent(error.response.data.message);
      }

      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_STORE_SWAP.title,
    detail: swapDetail,
    proceedBtnText: modalPropsMap.MODAL_STORE_SWAP.confirmMessage,
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
            modalContents={modalContent}
            closeModal={props.closeModal}
            url={"/store"}
            urlTitle={"까비상점으로 이동"}
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
