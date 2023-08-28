import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import PasswordContainer from "@/components/Modals/PasswordCheckModal/PasswordContainer";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import {
  axiosCabinetById,
  axiosLentShareId,
  axiosMyLentInfo,
} from "@/api/axios/axios.custom";
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
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

  const loadSharedWrongCodeCounts = () => {
    const savedData = localStorage.getItem("wrongCodeCounts");
    if (savedData) {
      try {
        const { data, expirationTime } = JSON.parse(savedData);
        const ExpirationTime = new Date(expirationTime);
        if (ExpirationTime > new Date()) {
          return data;
        } else {
          localStorage.removeItem("wrongCodeCounts");
        }
      } catch (error) {
        console.error("WrongCodeCounts:", error);
      }
    }
    return {};
  };

  const saveSharedWrongCodeCounts = (data: any) => {
    const expirationTime = new Date(
      new Date().getTime() + 10 * 60 * 1000
    ).toString();
    const dataToSave = JSON.stringify({ data, expirationTime });
    localStorage.setItem("wrongCodeCounts", dataToSave);
  };

  const [sharedWrongCodeCounts] = useState(loadSharedWrongCodeCounts);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) {
      e.target.value = code;
      return;
    }
    setCode(e.target.value);
  };

  const updatedCounts = {
    ...sharedWrongCodeCounts,
    [String(props.cabinetId)]:
      (sharedWrongCodeCounts[String(props.cabinetId)] || 0) + 1,
  };

  const tryLentRequest = async () => {
    try {
      await axiosLentShareId(currentCabinetId, parseInt(code));
      setMyInfo({ ...myInfo, cabinetId: currentCabinetId });
      setIsCurrentSectionRender(true);
      setModalTitle("대여가 완료되었습니다");
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        saveSharedWrongCodeCounts(updatedCounts);
        throw error;
      }
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
      throw error;
    } finally {
      setShowResponseModal(true);
    }
  };

  const onSendCode = async () => {
    try {
      //초대코드 받아오는 api 넣어야 함.
      const sharedCode = "4242";

      if (code === sharedCode) {
        await tryLentRequest();
      } else {
        const updatedCounts = {
          ...sharedWrongCodeCounts,
          [String(props.cabinetId)]:
            (sharedWrongCodeCounts[String(props.cabinetId)] || 0) + 1,
        };
        saveSharedWrongCodeCounts(updatedCounts);
        setModalTitle("일치하지 않는 초대 코드입니다.");
        setHasErrorOnResponse(true);
        setShowResponseModal(true);
      }
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
      setShowResponseModal(true);
    }
  };

  const InvititaionCodeModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap["MODAL_INVITATION_CODE"].title,
    detail: `공유 사물함 입장을 위한
    초대 코드를 입력해 주세요.
    <strong>3번 이상 일치하지 않을 시</strong> 입장이 제한됩니다.`,
    proceedBtnText: modalPropsMap["MODAL_INVITATION_CODE"].confirmMessage,
    onClickProceed: tryLentRequest,
    renderAdditionalComponent: () => (
      <PasswordContainer onChange={onChange} password={code} />
    ),
    closeModal: props.onClose,
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
