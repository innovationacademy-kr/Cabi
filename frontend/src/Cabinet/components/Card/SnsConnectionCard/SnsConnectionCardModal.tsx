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

// TODO : props interface 정의 & 사용

// 모달에 관련된건 되도록이면 이 컴포넌트안에.
const SnsConnectionCardModal = ({
  setIsModalOpen,
  currentProvider,
  newProvider,
  tryDisconnectSocialAccount,
  setMyInfo,
  connectService,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProvider: TLoginProvider | "";
  newProvider: TLoginProvider;
  // TODO : newProvider 타입 정의
  tryDisconnectSocialAccount: () => Promise<any>;
  setMyInfo: SetterOrUpdater<UserDto>;
  connectService: (provider: TLoginProvider) => void;
}) => {
  // TODO : setIsModalOpen(false)로. 버튼 누르면
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContents, setModalContents] = useState("");
  // TODO : modalContents, modalTitle 사용해야함

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
          const response = await axiosMyInfo();
          setMyInfo(response.data);

          if (response.data.userOauthConnection === null) {
            connectService(newProvider);
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
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
    // TODO : 기존 연결 끊고 -> 새로운 소셜 계정 연동
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
            modalContents={modalContents}
            closeModal={handleCloseModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            modalContents={modalContents}
            closeModal={handleCloseModal}
          />
        ))}
    </ModalPortal>
  );
};

export default SnsConnectionCardModal;
// TODO : 컴포넌트, 파일 이름 및 위치 변경
