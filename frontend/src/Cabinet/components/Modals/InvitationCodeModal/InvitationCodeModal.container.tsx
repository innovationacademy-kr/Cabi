import {
  axiosCabinetById,
  axiosLentShareId,
  axiosMyLentInfo,
} from "@/Cabinet/api/axios/axios.custom";
import { modalPropsMap } from "@/Cabinet/assets/data/maps";
import { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import PasswordContainer from "@/Cabinet/components/Modals/PasswordCheckModal/PasswordContainer";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/Cabinet/types/dto/cabinet.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import PasswordCheckModal from "../PasswordCheckModal/PasswordCheckModal";

const InvitationCodeModalContainer: React.FC<{
  onClose: () => void;
  cabinetId: Number;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [code, setCode] = useState("");
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [myInfo, setMyInfo] = useRecoilState(userState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) {
      e.target.value = code;
      return;
    }
    setCode(e.target.value);
  };

  const tryLentRequest = async () => {
    try {
      await axiosLentShareId(currentCabinetId, code);
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      setIsCurrentSectionRender(true);
      setModalTitle("공유 사물함 대기열에 입장하였습니다");

      // 병렬적으로 cabinet 과 lent info 불러오기
      const [cabinetData, myLentData] = await Promise.all([
        axiosCabinetById(currentCabinetId),
        axiosMyLentInfo(),
      ]);

      setTargetCabinetInfo(cabinetData.data);
      setMyLentInfo(myLentData.data);
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      setModalTitle(errorMessage);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const InvititaionCodeModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap["MODAL_INVITATION_CODE"].title,
    detail: `공유 사물함 입장을 위한
    초대 코드를 입력해 주세요.
    <strong>3번 이상 일치하지 않을 시</strong> 입장이 제한됩니다.`,
    proceedBtnText: modalPropsMap["MODAL_INVITATION_CODE"].confirmMessage,
    onClickProceed: tryLentRequest,
    renderAdditionalComponent: () => (
      <PasswordContainer
        onChange={onChange}
        password={code}
        tryLentRequest={tryLentRequest}
      />
    ),
    closeModal: props.onClose,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && (
        <PasswordCheckModal
          password={code}
          modalContents={InvititaionCodeModalContents}
        />
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={props.onClose}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={props.onClose}
          />
        ))}
    </ModalPortal>
  );
};

export default InvitationCodeModalContainer;
