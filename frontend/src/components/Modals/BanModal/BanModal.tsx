import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetUserInfoState,
  numberOfAdminWorkState,
  bannedUserListState,
} from "@/recoil/atoms";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import {
  axiosDeleteCurrentBanLog,
  axiosGetBannedUserList,
} from "@/api/axios/axios.custom";
import { handleBannedUserList } from "@/utils/tableUtils";

const BanModal: React.FC<{
  userId: number;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  // const currentUserId = useRecoilValue(currentUserIdState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setTargetUserInfo = useSetRecoilState(targetUserInfoState);
  const setNumberOfAdminWork = useSetRecoilState(numberOfAdminWorkState);
  const setBannedUserList = useSetRecoilState(bannedUserListState);

  const returnDetail = `특별한 사유가 있을 때만 해제가 가능합니다.
  이 기능은 로그에 기록됩니다.
  해제하시겠습니까?`;
  const tryReturnRequest = async (e: React.MouseEvent) => {
    try {
      // 패널티 해제 API 호출
      await axiosDeleteCurrentBanLog(props.userId);
      setIsCurrentSectionRender(true);
      setModalTitle("해제되었습니다");
      // 리코일 유저 정보 변경
      setTargetUserInfo((prev) => ({
        ...prev,
        bannedDate: undefined,
        unbannedDate: undefined,
      }));
      // SearchPage 데이터 업데이트 플래그
      setNumberOfAdminWork((prev) => prev + 1);

      const bannedUserData = await axiosGetBannedUserList();
      setBannedUserList(handleBannedUserList(bannedUserData));
    } catch (error: any) {
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const returnModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap[additionalModalType.MODAL_BAN].title,
    detail: returnDetail,
    proceedBtnText: modalPropsMap[additionalModalType.MODAL_BAN].confirmMessage,
    onClickProceed: tryReturnRequest,
    closeModal: props.closeModal,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={returnModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={props.closeModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={props.closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default BanModal;
