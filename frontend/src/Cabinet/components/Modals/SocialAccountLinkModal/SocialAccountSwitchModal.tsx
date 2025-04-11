import { useRecoilValue } from "recoil";
import { targetLinkProviderState } from "@/Cabinet/recoil/atoms";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import useDebounce from "@/Cabinet/hooks/useDebounce";
import useOAuth from "@/Cabinet/hooks/useOAuth";

const SocialAccountSwitchModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const targetProvider = useRecoilValue(targetLinkProviderState);
  const { debounce } = useDebounce();
  const { handleSocialAccountLink, tryUnlinkSocialAccount, getMyInfo } =
    useOAuth();
  const modalDetail = `<strong>현재 연결된 계정이 해제</strong>되고,
<strong>새로운 계정이 연결</strong>됩니다.
계속 진행하시겠습니까?`;

  const trySwitchSocialAccount = (e: React.MouseEvent<Element, MouseEvent>) => {
    debounce(
      "accountSwitch",
      async () => {
        try {
          await tryUnlinkSocialAccount();
          await getMyInfo();

          handleSocialAccountLink(targetProvider);
        } catch (error) {
          console.error(error);
        }
      },
      300
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 전환",
    detail: modalDetail,
    proceedBtnText: "네, 전환할게요",
    cancelBtnText: "취소",
    onClickProceed: (e) => Promise.resolve(trySwitchSocialAccount(e)),
    closeModal: handleCloseModal,
  };

  return <Modal modalContents={modalContents} />;
};

export default SocialAccountSwitchModal;
