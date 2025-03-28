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
  tryDisconnectSocialAccount: () => Promise<any>;
  setMyInfo: SetterOrUpdater<UserDto>;
  connectService: (provider: TOAuthProvider) => void;
}

// 모달에 관련된건 되도록이면 이 컴포넌트안에.
const SocialAccountSwitchModal = ({
  setIsModalOpen,
  currentProvider,
  newProvider,
  tryDisconnectSocialAccount,
  setMyInfo,
  connectService,
}: ISocialAccountLinkCardModalProps) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const modalDetail = `연결돼 있는 ${currentProvider} 연결 해제하고 ${newProvider}을 연결할까요?`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // TODO : 기존 연결 끊고 -> 새로운 소셜 계정 연결. 주석 변경 필요
  const connectAnotherService = async () => {
    try {
      const response = await tryDisconnectSocialAccount();

      if (response.status === HttpStatusCode.Ok) {
        try {
          const { data } = await axiosMyInfo();
          setMyInfo(data);

          if (data.userOauthConnection === null) {
            await connectService(newProvider);
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

  const connectServiceModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 전환",
    detail: modalDetail,
    proceedBtnText: "네, 변경할게요",
    cancelBtnText: "취소",
    onClickProceed: connectAnotherService,
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

export default SocialAccountSwitchModal;
// TODO : 컴포넌트, 파일 이름 및 위치 변경
