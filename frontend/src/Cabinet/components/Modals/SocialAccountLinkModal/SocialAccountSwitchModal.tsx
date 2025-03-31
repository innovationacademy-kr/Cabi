import { HttpStatusCode } from "axios";
import { useState } from "react";
import { SetterOrUpdater } from "recoil";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";

interface ISocialAccountLinkCardModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: TOAuthProvider;
  newProvider: TOAuthProvider;
  tryUnlinkSocialAccount: () => Promise<any>;
  setMyInfo: SetterOrUpdater<UserDto>;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
}
// TODO : 인터페이스 정의? 너무 장황하긴 함..

const SocialAccountSwitchModal = ({
  setIsModalOpen,
  currentProvider,
  newProvider,
  tryUnlinkSocialAccount,
  setMyInfo,
  tryLinkSocialAccount,
}: ISocialAccountLinkCardModalProps) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const modalDetail = `${currentProvider} 계정 연결을 해제하고 
${newProvider} 계정을 연결할까요?`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUnlink = async () => {
    const response = await tryUnlinkSocialAccount();
    if (response.status !== HttpStatusCode.Ok) {
      throw new Error("unlink failed.");
    }
  };

  const getMyInfo = async () => {
    const response = await axiosMyInfo();
    if (response.status === HttpStatusCode.Ok) {
      setMyInfo(response.data);
      return response.data;
    } else {
      throw new Error("fetch user's info failed");
    }
  };

  const handleLink = async () => {
    tryLinkSocialAccount(newProvider);
    setModalTitle("계정 전환 성공");
  };
  // TODO: handleUnlink, getMyInfo, handleLink 상위 컴포넌트 내의 함수와 통일

  const trySwitchSocialAccount = async () => {
    try {
      await handleUnlink();
      await getMyInfo();

      handleLink();
    } catch (error) {
      console.error(error);
      setModalTitle("계정 전환 실패");
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const linkSocialAccountModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 전환",
    detail: modalDetail,
    proceedBtnText: "네, 변경할게요",
    cancelBtnText: "취소",
    onClickProceed: trySwitchSocialAccount,
    closeModal: handleCloseModal,
  };

  return (
    <>
      {!showResponseModal && (
        <Modal modalContents={linkSocialAccountModalContents} />
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={handleCloseModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={handleCloseModal}
          />
        ))}
    </>
  );
};

export default SocialAccountSwitchModal;
