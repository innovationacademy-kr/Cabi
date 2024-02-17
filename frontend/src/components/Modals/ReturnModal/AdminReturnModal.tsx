import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  currentFloorNumberState,
  currentSectionNameState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  overdueCabinetListState,
  targetCabinetInfoState,
  targetUserInfoState,
} from "@/recoil/atoms";
import Selector from "@/components/Common/Selector";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { UserInfo } from "@/types/dto/user.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import IconType from "@/types/enum/icon.type.enum";
import {
  axiosBundleReturn,
  axiosCabinetById,
  axiosGetOverdueUserList,
  axiosReturnByUserId,
} from "@/api/axios/axios.custom";
import useMultiSelect from "@/hooks/useMultiSelect";
import { handleOverdueUserList } from "@/utils/tableUtils";

const AdminReturnModal: React.FC<{
  lentType?: CabinetType;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setOverdueUserList = useSetRecoilState(overdueCabinetListState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const currentFloor = useRecoilValue(currentFloorNumberState);
  const currentSection = useRecoilValue(currentSectionNameState);
  const setNumberOfAdminWork = useSetRecoilState<number>(
    numberOfAdminWorkState
  );
  const [targetUserInfo, setTargetUserInfo] =
    useRecoilState(targetUserInfoState);
  const targetCabinetInfo = useRecoilValue<CabinetInfo>(targetCabinetInfoState);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { targetCabinetInfoList, isMultiSelect, closeMultiSelectMode } =
    useMultiSelect();

  const getReturnDetail = (lentType: CabinetType) => {
    const detail = `<strong>${targetCabinetInfo.floor}층 ${targetCabinetInfo.section} ${targetCabinetInfo.visibleNum}번 사물함</strong>`;
    if (lentType === CabinetType.PRIVATE || lentType === CabinetType.CLUB) {
      return detail + `<br>해당 사물함을 정말 반납하시겠습니까?`;
    }
    return detail + `<br>반납할 유저를 선택해 주세요.`;
  };

  const getBundleReturnDetail = () => {
    if (targetCabinetInfoList.length >= 1) {
      const countReturnable = () => {
        let cnt = 0;
        targetCabinetInfoList.forEach((cabinet) => {
          if (cabinet.userCount >= 1) cnt++;
        });
        return cnt;
      };
      const detail = `<strong>${currentFloor}층 ${currentSection}</strong><br>선택한 <strong>${
        targetCabinetInfoList.length
      }</strong>개의 사물함 중 <strong>${countReturnable()}</strong>개 사물함이 반납 가능합니다.<br>해당 사물함들을 반납 하시겠습니까?`;
      return detail;
    }
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const renderSelector = () => (
    <Selector
      iconSrc="/src/assets/images/shareIcon.svg"
      selectList={targetCabinetInfo.lents.map((info) => {
        return { key: info.userId, value: info.name };
      })}
      onClickSelect={handleSelectUser}
    />
  );

  const tryReturnRequest = async (e: React.MouseEvent) => {
    try {
      if (currentCabinetId !== null)
        await axiosBundleReturn([currentCabinetId]);
      //userCabinetId 세팅
      setIsCurrentSectionRender(true);
      setNumberOfAdminWork((prev) => prev + 1);
      setModalTitle("반납되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      const overdueUserData = await axiosGetOverdueUserList();
      setOverdueUserList(handleOverdueUserList(overdueUserData));
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
        if (targetUserInfo) {
          const changedInfo: UserInfo = {
            ...targetUserInfo,
            cabinetId: undefined,
            cabinetInfo: undefined,
          };
          setTargetUserInfo(changedInfo);
        }
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const tryShareReturnRequest = async (e: React.MouseEvent) => {
    // const requests = selectedUserIds.map((id) => axiosReturnByUserId(id));
    // const requests = axiosReturnByUserId(selectedUserIds);
    // if (requests.length === 0) {
    //   try {
    //     setHasErrorOnResponse(true);
    //     setModalTitle("반납할 유저를 선택해야 합니다.");
    //   } finally {
    //     setShowResponseModal(true);
    //   }
    //   return;
    // }
    try {
      if (selectedUserIds.length === 0) {
        setHasErrorOnResponse(true);
        setModalTitle("반납할 유저를 선택해야 합니다.");
        setShowResponseModal(true);
        return;
      }
      await axiosReturnByUserId(selectedUserIds)
      .then(async (res) => {
        setIsCurrentSectionRender(true);
        setNumberOfAdminWork((prev) => prev + 1);
        setModalTitle("반납되었습니다");
        const overdueUserData = await axiosGetOverdueUserList();
        setOverdueUserList(handleOverdueUserList(overdueUserData));
        setSelectedUserIds([]);
        try {
          const { data } = await axiosCabinetById(currentCabinetId);
          setTargetCabinetInfo(data);
        } catch (error) {
          throw error;
        }
      })
      .catch((error) => {
        setHasErrorOnResponse(true);
        setModalTitle(error.response.data.message);
      })
      .finally(() => {
        setShowResponseModal(true);
      });
  } catch (error) {
    console.error(error);
  }
};

  const tryBundleReturnRequest = async (e: React.MouseEvent) => {
    const returnableCabinetIdList = targetCabinetInfoList
      .map((cabinet) => {
        if (cabinet.userCount >= 1) return cabinet.cabinetId;
      })
      .filter((id) => id);
    try {
      await axiosBundleReturn(returnableCabinetIdList as number[]);
      setIsCurrentSectionRender(true);
      setNumberOfAdminWork((prev) => prev + 1);
      //캐비넷 상세정보 바뀌는 곳
      setModalTitle("반납되었습니다");
      const overdueUserData = await axiosGetOverdueUserList();
      setOverdueUserList(handleOverdueUserList(overdueUserData));
      //closeMultiSelectMode();
    } catch (error: any) {
      setHasErrorOnResponse(true);
      setModalTitle(error.response.data.message);
    } finally {
      setShowResponseModal(true);
    }
  };

  const returnModalContents: IModalContents = isMultiSelect
    ? {
        type: "hasProceedBtn",
        title: modalPropsMap[additionalModalType.MODAL_ADMIN_RETURN].title,
        detail: getBundleReturnDetail(),
        proceedBtnText:
          modalPropsMap[additionalModalType.MODAL_ADMIN_RETURN].confirmMessage,
        onClickProceed: tryBundleReturnRequest,
        closeModal: props.closeModal,
        iconType: IconType.CHECKICON,
      }
    : {
        type: "hasProceedBtn",
        title: modalPropsMap[additionalModalType.MODAL_ADMIN_RETURN].title,
        detail: getReturnDetail(props.lentType!),
        proceedBtnText:
          modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
        renderAdditionalComponent:
          props.lentType === CabinetType.SHARE ? renderSelector : undefined,
        onClickProceed:
          props.lentType === CabinetType.SHARE
            ? tryShareReturnRequest
            : tryReturnRequest,
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

export default AdminReturnModal;
