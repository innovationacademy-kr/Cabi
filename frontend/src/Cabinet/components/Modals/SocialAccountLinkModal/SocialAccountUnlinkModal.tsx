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
  tryDisconnectSocialAccount,
  getMyInfo,
  setIsModalOpen,
  currentProvider,
}: {
  tryDisconnectSocialAccount: () => Promise<any>;
  getMyInfo: () => Promise<void>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: "" | TOAuthProvider;
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const modalDetail = `${currentProvider} 계정 연결을 해제하시겠습니까?`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // TODO : 아무 버튼 누르면 모든 실행이 다 끝나고 finally setIsUnlinkModalOpen(false)

  const tryUnlinkService = async () => {
    try {
      const response = await tryDisconnectSocialAccount();
      if (response.status === HttpStatusCode.Ok) {
        await getMyInfo();
        setModalTitle("연결 해제 성공");
      }
    } catch (error) {
      console.error(error);
      setHasErrorOnResponse(true);
      setModalTitle("연결 해제 실패");
    } finally {
      setShowResponseModal(true);
    }
  };

  const connectServiceModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 연결 해제",
    // TODO : modalTitle state 사용?
    detail: modalDetail,
    proceedBtnText: "네, 해제할게요",
    cancelBtnText: "취소",
    onClickProceed: tryUnlinkService,
    closeModal: handleCloseModal,
  };

  return (
    <>
      {!showResponseModal && (
        <Modal modalContents={connectServiceModalContents} />
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
