import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

interface ISocialAccountLinkCardModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: TOAuthProvider;
  newProvider: TOAuthProvider;
  tryUnlinkSocialAccount: () => Promise<any>;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
  getMyInfo: () => Promise<void>;
}

const SocialAccountSwitchModal = ({
  setIsModalOpen,
  currentProvider,
  newProvider,
  tryUnlinkSocialAccount,
  tryLinkSocialAccount,
  getMyInfo,
}: ISocialAccountLinkCardModalProps) => {
  const modalDetail = `${currentProvider} 계정 연결을 해제하고 
${newProvider} 계정을 연결할까요?`;
  // TODO : 원래 계정 연결이 해제되고, 새로운 계정이 연결됩니다. 계속하시겠습니까? 로 수정

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const trySwitchSocialAccount = async () => {
    try {
      await tryUnlinkSocialAccount();
      await getMyInfo();

      tryLinkSocialAccount(newProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const socialAccountLinkModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 전환",
    detail: modalDetail,
    proceedBtnText: "네, 변경할게요",
    cancelBtnText: "취소",
    onClickProceed: trySwitchSocialAccount,
    closeModal: handleCloseModal,
  };

  return <Modal modalContents={socialAccountLinkModalContents} />;
};

export default SocialAccountSwitchModal;
