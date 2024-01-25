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
import PasswordCheckModal from "@/components/Modals/PasswordCheckModal/PasswordCheckModal";
import PasswordContainer from "@/components/Modals/PasswordCheckModal/PasswordContainer";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { modalPropsMap } from "@/assets/data/maps";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import IconType from "@/types/enum/icon.type.enum";
import {
  axiosCabinetById,
  axiosMyLentInfo,
  axiosSendCabinetPassword,
} from "@/api/axios/axios.custom";

const PasswordCheckModalContainer: React.FC<{
  onClose: () => void;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myInfo, setMyInfo] = useRecoilState(userState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) {
      e.target.value = password;
      return;
    }
    setPassword(e.target.value);
  };

  const onSendPassword = async () => {
    setIsLoading(true);
    try {
      await axiosSendCabinetPassword(password);
      //userCabinetId 세팅
      setMyInfo({ ...myInfo, cabinetId: null });
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
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      throw error;
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const passwordCheckModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap["MODAL_CLUB_MODIFY_PW"].title,
    detail: `공유 사물함 입장을 위한 초대코드를 입력해 주세요`,
    proceedBtnText: modalPropsMap["MODAL_CLUB_MODIFY_PW"].confirmMessage,
    onClickProceed: onSendPassword,
    renderAdditionalComponent: () => (
      <PasswordContainer onChange={onChange} password={password} />
    ),
    closeModal: props.onClose,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
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
