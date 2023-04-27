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
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { getExpireDateString } from "@/utils";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import PasswordCheckModal from "./PasswordCheckModal";
import PasswordContainer from "./PasswordContainer";

const PasswordCheckModalContainer: React.FC<{
  onClose: () => void;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

  const passwordCheckModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: "반납 시  비밀번호",
    detail: `비밀번호는 <strong>1111</strong>로 초기화해서
    반납하시는 것을 권장합니다.`,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
    onClickProceed: async (e: React.MouseEvent<Element, MouseEvent>) => {},
    renderAdditionalComponent: () => <PasswordContainer onChange={onChange} password={password} />,
    closeModal: props.onClose,
  };

  const [password, setPassword] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) return;
    setPassword(e.target.value);
  };

  return (
    <ModalPortal>
      {!showResponseModal && (
        <PasswordCheckModal password={password} modalContents={passwordCheckModalContents} />
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
