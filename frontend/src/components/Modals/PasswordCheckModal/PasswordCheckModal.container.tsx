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
import PasswordCheckModal, { IPasswordState } from "./PasswordCheckModal";

const PasswordCheckModalContainer: React.FC<{
  onClose: ()=>void;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const [myLentInfo, setMyLentInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const [passwordState, setPasswordState] = useState<IPasswordState>({
    num1 : null,
    num2 : null,
    num3 : null,
    num4 : null
  })

  const returnModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: '반납 시  비밀번호',
    detail: `비밀번호는 <strong>1111</strong>로 초기화해서
    반납하시는 것을 권장합니다.`,
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
    onClickProceed: async (e:React.MouseEvent<Element, MouseEvent>)=>{},
    closeModal: props.onClose,
  };

  const onKeyDown = (index:number, e:React.KeyboardEvent) => {
    const currentInput = inputs.current[index];
    const previousInput = inputs.current[index - 1];

    if (e.key === 'Backspace' && currentInput && currentInput.value.length === 1) {
      e.preventDefault();
      currentInput.value='';
      setPasswordState({
        ...passwordState,
        ['num' + (index + 1)] : null
      })
      return;
    }

    if (e.key === 'Backspace' && currentInput && currentInput.value === '') {
      e.preventDefault();

      if (previousInput) {
        previousInput.focus();
        previousInput.value = '';
        setPasswordState({
          ...passwordState
        })
      }
    }
  };

  const onChangeInput = (index:number, e:React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]+$/;
    if(!regex.test(e.currentTarget.value)) return;
    setPasswordState({
      ...passwordState,
      [e.target.name] : e.currentTarget.value
    })
    const input = e.target;
    const { value } = input;

    if (value.length === 1 && index < inputs.current.length - 1 ) {
      inputs.current[index + 1].focus();
    }
  }
  
  const inputs = useRef<HTMLInputElement[]>([]);


  return (
    <ModalPortal>
      {!showResponseModal && <PasswordCheckModal onKeyDown={onKeyDown} inputs={inputs} onChangeInput={onChangeInput} passwordState={passwordState} modalContents={returnModalContents} />}
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
