import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  selectedClubInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { ClubLogResponseType, ClubUserDto } from "@/types/dto/lent.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import {
  axiosCabinetById,
  axiosGetClubUserLog,
  axiosLentClubUser,
  axiosLentId,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubLentModal: React.FC<{
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
  const selectedClubInfo = useRecoilValue(selectedClubInfoState);

  const [clubLog, setClubLog] = useState<ClubLogResponseType>(undefined);

  const getLentLog = async () => {
    try {
      const response = await axiosGetClubUserLog(0);
      const clubListLogs: ClubUserDto[] = response.data.result;
      setClubLog(clubListLogs);
    } catch (error) {
      setClubLog(STATUS_400_BAD_REQUEST);
      console.log(error);
    }
  };
  useEffect(() => {
    getLentLog();
  }, []);

  const tryLentRequest = async (e: React.MouseEvent) => {
    try {
      await axiosLentClubUser(selectedClubInfo!.userId, currentCabinetId!, "");
      setIsCurrentSectionRender(true);
      setModalTitle("대여가 완료되었습니다");
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const ClubLentModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: "",
    detail: "사물함을 대여할 동아리를 선택해주세요.",
    proceedBtnText: modalPropsMap[CabinetType.CLUB].confirmMessage,
    onClickProceed: tryLentRequest,
    closeModal: props.closeModal,
    clubList: clubLog,
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
