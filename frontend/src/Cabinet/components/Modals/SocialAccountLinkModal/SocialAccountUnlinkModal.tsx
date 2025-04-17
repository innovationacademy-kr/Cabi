import { useState } from "react";
import { useRecoilValue } from "recoil";
import { linkedProviderState } from "@/Cabinet/recoil/selectors";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import useDebounce from "@/Cabinet/hooks/useDebounce";
import useOAuth from "@/Cabinet/hooks/useOAuth";

const SocialAccountUnlinkModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("소셜 계정 연결 해제");
  const linkedProvider = useRecoilValue(linkedProviderState);
  const modalDetail = `${
    linkedProvider || "소셜"
  } 계정 연결을 해제하시겠습니까?`;
  const { debounce } = useDebounce();
  const { tryUnlinkSocialAccount, getMyInfo } = useOAuth();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClickUnlinkButton = (
    e: React.MouseEvent<Element, MouseEvent>
  ) => {
    debounce(
      "accountUnlink",
      async () => {
        try {
          await tryUnlinkSocialAccount();
          await getMyInfo();
          setModalTitle("연결 해제 성공");
        } catch (error) {
          setHasErrorOnResponse(true);
          setModalTitle("연결 해제 실패");
        } finally {
          setShowResponseModal(true);
        }
      },
      300
    );
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: modalTitle,
    detail: modalDetail,
    proceedBtnText: "네, 해제할게요",
    cancelBtnText: "취소",
    onClickProceed: (e) => Promise.resolve(handleClickUnlinkButton(e)),
    closeModal: handleCloseModal,
  };

  if (!showResponseModal) return <Modal modalContents={modalContents} />;
  if (hasErrorOnResponse)
    return (
      <FailResponseModal
        modalTitle={modalTitle}
        closeModal={handleCloseModal}
      />
    );
  else
    return (
      <SuccessResponseModal
        modalTitle={modalTitle}
        closeModal={handleCloseModal}
      />
    );
};

export default SocialAccountUnlinkModal;
