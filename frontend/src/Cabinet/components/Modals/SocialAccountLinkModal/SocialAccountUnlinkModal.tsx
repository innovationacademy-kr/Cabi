import { HttpStatusCode } from "axios";
import { useState } from "react";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

const SocialAccountUnlinkModal = ({
  tryUnlinkSocialAccount,
  getMyInfo,
  setIsModalOpen,
  currentProvider,
}: {
  tryUnlinkSocialAccount: () => Promise<any>;
  getMyInfo: () => Promise<void>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: "" | TOAuthProvider;
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("소셜 계정 연결 해제");
  const modalDetail = `${currentProvider} 계정 연결을 해제하시겠습니까?`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUnlinkButton = async () => {
    try {
      const response = await tryUnlinkSocialAccount();

      if (response.status === HttpStatusCode.Ok) {
        await getMyInfo();
        setModalTitle("연결 해제 성공");
      }
    } catch (error) {
      setHasErrorOnResponse(true);
      setModalTitle("연결 해제 실패");
      console.error(error);
    } finally {
      setShowResponseModal(true);
    }
  };

  const socialAccountUnlinkModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: modalTitle,
    detail: modalDetail,
    proceedBtnText: "네, 해제할게요",
    cancelBtnText: "취소",
    onClickProceed: handleUnlinkButton,
    closeModal: handleCloseModal,
  };

  return (
    <>
      {!showResponseModal && (
        <Modal modalContents={socialAccountUnlinkModalContents} />
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

export default SocialAccountUnlinkModal;
