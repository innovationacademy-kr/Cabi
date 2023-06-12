import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import checkIcon from "@/assets/images/checkIcon.svg";
import { MyCabinetInfoResponseDto } from "@ /types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import { getExpireDateString } from "@/utils/dateUtils";
import { modalPropsMap } from "@/assets/data/maps";
import {
  axiosCabinetById,
  axiosLentId,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";

const LentModal: React.FC<{
  lentType: string;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState(
    targetCabinetInfoState
  );
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const formattedExpireDate = getExpireDateString(props.lentType);
  const privateLentDetail = `대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.
    귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.`;
  const shareLentDetail = `${
    targetCabinetInfo.lent_info.length > 0 &&
    targetCabinetInfo.lent_info[0].expire_time !== null
      ? `대여기간은 <strong>${formattedExpireDate} 23:59</strong>까지 입니다.`
      : ""
  }
대여 후 ${
    import.meta.env.VITE_SHARE_EARLY_RETURN_PERIOD
  }시간 이내 취소(반납) 시,
${
  import.meta.env.VITE_SHARE_EARLY_RETURN_PENALTY
}시간의 대여 불가 패널티가 적용됩니다.
“메모 내용”은 공유 인원끼리 공유됩니다.
귀중품 분실 및 메모 내용의 유출에 책임지지 않습니다.`;
  const tryLentRequest = async (e: React.MouseEvent) => {
    try {
      await axiosLentId(currentCabinetId);
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinet_id: currentCabinetId });
      setIsCurrentSectionRender(true);
      setModalTitle("대여가 완료되었습니다");
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
        setMyLentInfo(myLentInfo);
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

  const lentModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap[CabinetStatus.AVAILABLE].title,
    detail: props.lentType === "PRIVATE" ? privateLentDetail : shareLentDetail,
    proceedBtnText: modalPropsMap[CabinetStatus.AVAILABLE].confirmMessage,
    onClickProceed: tryLentRequest,
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={lentModalContents} />}
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

export default LentModal;
