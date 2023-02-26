import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentCabinetIdState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import {
  axiosAdminReturn,
  axiosCabinetById,
  axiosReturnByUserId,
} from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import {
  SuccessResponseModal,
  FailResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import ModalPortal from "@/components/Modals/ModalPortal";
import { additionalModalType, modalPropsMap } from "@/assets/data/maps";
import checkIcon from "@/assets/images/checkIcon.svg";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import Selector from "@/components/Common/Selector";

const AdminReturnModal: React.FC<{
  lentType: CabinetType;
  closeModal: React.MouseEventHandler;
}> = (props) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const setTargetCabinetInfo = useSetRecoilState(targetCabinetInfoState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const setNumberOfAdminWork = useSetRecoilState<number>(
    numberOfAdminWorkState
  );
  const targetCabinetInfo = useRecoilValue<CabinetInfo>(targetCabinetInfoState);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const getReturnDetail = (lentType: CabinetType) => {
    const detail = `<strong>${targetCabinetInfo.floor}층 ${targetCabinetInfo.section} ${targetCabinetInfo.cabinet_num}번 사물함</strong>`;
    if (lentType === CabinetType.PRIVATE) {
      return detail + `<br>해당 사물함을 정말 반납하시겠습니까?`;
    }
    return detail + `<br>반납할 유저를 선택해 주세요.`;
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      const idx = selectedUserIds.indexOf(userId);
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const renderSelector = () => (
    <Selector
      iconSrc="/src/assets/images/shareIcon.svg"
      selectList={targetCabinetInfo.lent_info.map((info) => {
        return { key: info.user_id, value: info.intra_id };
      })}
      onClickSelect={handleSelectUser}
    />
  );

  const tryReturnRequest = async (e: React.MouseEvent) => {
    try {
      await axiosAdminReturn(currentCabinetId);
      //userCabinetId 세팅
      setIsCurrentSectionRender(true);
      setNumberOfAdminWork((prev) => prev + 1);
      setModalTitle("반납되었습니다");
      // 캐비닛 상세정보 바꾸는 곳
      try {
        const { data } = await axiosCabinetById(currentCabinetId);
        setTargetCabinetInfo(data);
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
    const requests = selectedUserIds.map((id) => axiosReturnByUserId(id));
    if (requests.length === 0) {
      try {
        setHasErrorOnResponse(true);
        setModalTitle("반납할 유저를 선택해야 합니다.");
      } finally {
        setShowResponseModal(true);
      }
      return;
    }
    await Promise.all(requests)
      .then(async (res) => {
        setIsCurrentSectionRender(true);
        setNumberOfAdminWork((prev) => prev + 1);
        setModalTitle("반납되었습니다");
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
  };

  const returnModalContents: IModalContents = {
    type: "hasProceedBtn",
    icon: checkIcon,
    title: modalPropsMap[additionalModalType.MODAL_ADMIN_RETURN].title,
    detail: getReturnDetail(props.lentType),
    proceedBtnText:
      modalPropsMap[additionalModalType.MODAL_RETURN].confirmMessage,
    renderAdditionalComponent:
      props.lentType === CabinetType.SHARE ? renderSelector : undefined,
    onClickProceed:
      props.lentType === CabinetType.SHARE
        ? tryShareReturnRequest
        : tryReturnRequest,
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

export default AdminReturnModal;
