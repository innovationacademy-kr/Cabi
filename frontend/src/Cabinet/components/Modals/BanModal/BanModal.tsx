import {
  axiosDeleteCurrentBanLog,
  axiosGetBannedUserList,
} from "@/Cabinet/api/axios/axios.custom";
import { additionalModalType, modalPropsMap } from "@/Cabinet/assets/data/maps";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import {
  bannedUserListState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  targetUserInfoState,
} from "@/Cabinet/recoil/atoms";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { handleBannedUserList } from "@/Cabinet/utils/tableUtils";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";

const BanModal: React.FC<{
  userId: number | null;
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
        bannedAt: undefined,
        unbannedAt: undefined,
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
    title: modalPropsMap[additionalModalType.MODAL_BAN].title,
    detail: returnDetail,
    proceedBtnText: modalPropsMap[additionalModalType.MODAL_BAN].confirmMessage,
    onClickProceed: tryReturnRequest,
    closeModal: props.closeModal,
    iconType: IconType.CHECKICON,
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
