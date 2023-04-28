import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  myCabinetInfoState,
  overdueCabinetListState,
  targetCabinetInfoState,
  userState,
} from "@/recoil/atoms";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosReturn,
  axiosSendCabinetPassword,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import PasswordCheckModal from "./PasswordCheckModal";
import PasswordContainer from "./PasswordContainer";

const PasswordCheckModalContainer: React.FC<{
  onClose: () => void;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [password, setPassword] = useState("");
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) return;
    setPassword(e.target.value);
  };

  const onSendPassword = async () => {
    try {
      await axiosSendCabinetPassword(password);
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinet_id: -1 });
      setIsCurrentSectionRender(true);
      setModalTitle("반납되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
      } catch (error) {
        throw error;
      }
      try {
        const { data: myLentInfo } = await axiosMyLentInfo();
        setMyLentInfo(myLentInfo);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    } finally {
      setShowResponseModal(true);
    }
  };

  const passwordCheckModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap["PASSWORD_CHECK"].title,
    detail: `비밀번호는 <strong>1111</strong>로 초기화해서
    반납하시는 것을 권장합니다.`,
    proceedBtnText: modalPropsMap["PASSWORD_CHECK"].confirmMessage,
    onClickProceed: onSendPassword,
    renderAdditionalComponent: () => (
      <PasswordContainer onChange={onChange} password={password} />
    ),
    closeModal: props.onClose,
  };

  return (
    <ModalPortal>
      {!showResponseModal && (
        <PasswordCheckModal
          password={password}
          modalContents={passwordCheckModalContents}
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

export default PasswordCheckModalContainer;
