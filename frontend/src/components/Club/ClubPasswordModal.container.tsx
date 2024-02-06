import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import { IModalContents } from "@/components//Modals/Modal";
import ModalPortal from "@/components//Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components//Modals/ResponseModal/ResponseModal";
import ClubPasswordModal from "@/components/Modals/PasswordCheckModal/ClubPasswordModal";
import { modalPropsMap } from "@/assets/data/maps";
import IconType from "@/types/enum/icon.type.enum";
import { axiosUpdateClubMemo } from "@/api/axios/axios.custom";
import useMultiSelect from "@/hooks/useMultiSelect";

interface ClubPasswordModalContainerInterface {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ClubPasswordModalInterface {
  ClubPwModalContents: IModalContents;
  password: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  list: string[];
  onClick: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  onClickBackground: () => void;
  onSendPassword: () => Promise<void>;
  handleEnterPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ClubPasswordModalContainer: React.FC<
  ClubPasswordModalContainerInterface
> = ({ password, setPassword, setShowPasswordModal }) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tmpPw, setTmpPw] = useState<string>("");
  const { clubId } = useRecoilValue(targetClubInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const [modalContent, setModalContent] = useState<string>("");
  const { isMultiSelect, closeMultiSelectMode } = useMultiSelect();
  const [list, setList] = useState(["", "", "", ""]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const closeModal = () => {
    setShowPasswordModal(false);
  };

  const onSendPassword = async () => {
    setIsLoading(true);
    try {
      await axiosUpdateClubMemo(clubId, tmpPw);
      setIsCurrentSectionRender(true);
      setModalTitle("비밀번호 변경 완료");
      setPassword(tmpPw);
    } catch (error: any) {
      setModalTitle("비밀번호 변경 실패");
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
      throw error;
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };

  const ClubPwModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: modalPropsMap.MODAL_CLUB_PAGE_SET_PW.title,
    detail: "동아리 사물함 비밀번호를 설정해주세요",
    proceedBtnText: modalPropsMap.MODAL_CLUB_PAGE_SET_PW.confirmMessage,
    cancelBtnText: "취소",
    closeModal: () => closeModal(),
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) {
      e.target.value = tmpPw;
      return;
    }
    setTmpPw(e.target.value);
  };

  const onClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const makeList = (inputString: string) => {
    const temp = [...inputString.split("")];
    for (let i = 0; i < 4 - inputString.length; i++) {
      temp.push("");
    }
    setList([...temp]);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    let inputString = tmpPw === password || !tmpPw ? password : tmpPw;
    makeList(inputString);
  }, [password, tmpPw]);

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || tmpPw.length < 4 || isLoading) return;
    onSendPassword();
  };

  const onClickBackground = () => {
    closeModal();
    if (isMultiSelect) {
      closeMultiSelectMode();
    }
  };

  return (
    <>
      <ModalPortal>
        {!showResponseModal && (
          <ClubPasswordModal
            ClubPwModalContents={ClubPwModalContents}
            password={password}
            onChange={onChange}
            list={list}
            onClick={onClick}
            inputRef={inputRef}
            onClickBackground={onClickBackground}
            onSendPassword={onSendPassword}
            handleEnterPress={handleEnterPress}
          />
        )}
        {showResponseModal &&
          (hasErrorOnResponse ? (
            <FailResponseModal
              modalTitle={modalTitle}
              modalContents={modalContent}
              closeModal={closeModal}
            />
          ) : (
            <SuccessResponseModal
              modalTitle={modalTitle}
              closeModal={closeModal}
            />
          ))}
      </ModalPortal>
    </>
  );
};

export default ClubPasswordModalContainer;
