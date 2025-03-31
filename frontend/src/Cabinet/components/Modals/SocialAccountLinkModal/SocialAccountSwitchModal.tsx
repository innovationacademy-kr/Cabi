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

  /**
   const trySwitchSocialAccount = async () => {
  try {
    await handleUnlink();
    const userInfo = await fetchUserInfo();

    if (!userInfo.userOauthConnection) {
      await handleLink();
      setModalTitle("연결 성공");
    }
  } catch (error) {
    console.error(error);
    setModalTitle("연결 실패");
    setHasErrorOnResponse(true);
  } finally {
    setShowResponseModal(true);
  }
};

const handleUnlink = async () => {
  const response = await tryUnlinkSocialAccount();
  if (response.status !== HttpStatusCode.Ok) {
    throw new Error("Unlink failed");
  }
};

const fetchUserInfo = async () => {
  const { data } = await axiosMyInfo();
  setMyInfo(data);
  return data;
};

const handleLink = async () => {
  await tryLinkSocialAccount(newProvider);
};
   */
  const trySwitchSocialAccount = async () => {
    try {
      const response = await tryUnlinkSocialAccount();

      if (response.status === HttpStatusCode.Ok) {
        try {
          const { data } = await axiosMyInfo();
          setMyInfo(data);

          if (data.userOauthConnection === null) {
            await tryLinkSocialAccount(newProvider);
            setModalTitle("연결 성공");
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
      setModalTitle("연결 실패");
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
