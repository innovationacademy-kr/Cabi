import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

interface ISocialAccountLinkCardModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newProvider: TOAuthProvider;
  tryUnlinkSocialAccount: () => Promise<any>;
  tryLinkSocialAccount: (provider: TOAuthProvider) => void;
  getMyInfo: () => Promise<void>;
}

const SocialAccountSwitchModal = ({
  setIsModalOpen,
  newProvider,
  tryUnlinkSocialAccount,
  tryLinkSocialAccount,
  getMyInfo,
}: ISocialAccountLinkCardModalProps) => {
  const modalDetail = `<strong>현재 연결된 계정이 해제</strong>되고,
<strong>새로운 계정이 연결</strong>됩니다.
계속 진행하시겠습니까?`;

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
    proceedBtnText: "네, 전환할게요",
    cancelBtnText: "취소",
    onClickProceed: trySwitchSocialAccount,
    closeModal: handleCloseModal,
  };

  return <Modal modalContents={socialAccountLinkModalContents} />;
};

export default SocialAccountSwitchModal;
