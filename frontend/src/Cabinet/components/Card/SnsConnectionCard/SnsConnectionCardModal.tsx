import { HttpStatusCode } from "axios";
import { useState } from "react";
import { SetterOrUpdater } from "recoil";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import { TLoginProvider } from "@/Cabinet/assets/data/login";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";

interface ISnsConnectionCardModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: TLoginProvider;
  newProvider: TLoginProvider;
  tryDisconnectSocialAccount: () => Promise<any>;
  setMyInfo: SetterOrUpdater<UserDto>;
  connectService: (provider: TLoginProvider) => void;
}

// 모달에 관련된건 되도록이면 이 컴포넌트안에.
const SnsConnectionCardModal = ({
  setIsModalOpen,
  currentProvider,
  newProvider,
  tryDisconnectSocialAccount,
  setMyInfo,
  connectService,
}: ISnsConnectionCardModalProps) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const modalDetail = `연동돼 있는 ${currentProvider} 연동 해제하고 ${newProvider}을 연동할까요?`;

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // TODO : 다른 모달들도 필요하면(생기면) 상위 컴포넌트로 이동

  // TODO : 기존 연결 끊고 -> 새로운 소셜 계정 연동. 주석 변경 필요
  const connectAnotherService = async () => {
    try {
      const response = await tryDisconnectSocialAccount();

      if (response.status === HttpStatusCode.Ok) {
        try {
          const { data } = await axiosMyInfo();
          setMyInfo(data);

          if (data.userOauthConnection === null) {
            await connectService(newProvider);
            setModalTitle("연동 성공");
            // TODO : 메시지 변경
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
      setModalTitle("연동 실패");
      // TODO : 메시지 변경
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const connectServiceModalContents: IModalContents = {
    type: "hasProceedBtn",
    iconType: IconType.CHECKICON,
    title: "소셜 계정 연동",
    // TODO : title 수정
    detail: modalDetail,
    proceedBtnText: "네, 새 계정을 연동하겠습니다",
    cancelBtnText: "취소",
    onClickProceed: connectAnotherService,
    closeModal: handleCloseModal,
  };

  return (
    <ModalPortal>
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
    </ModalPortal>
  );
};

export default SnsConnectionCardModal;
// TODO : 컴포넌트, 파일 이름 및 위치 변경
