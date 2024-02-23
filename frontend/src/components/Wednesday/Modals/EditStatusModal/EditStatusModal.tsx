import { useState } from "react";
import Dropdown from "@/components/Common/Dropdown";
import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import PresentationStatusType from "@/types/enum/Presentation/presentation.type.enum";
import IconType from "@/types/enum/icon.type.enum";

interface EditStatusModalProps {
  //   onClickProceed: (e: React.MouseEvent) => Promise<void>;
  closeModal: React.MouseEventHandler;
}

const STATUS_OPTIONS = [
  { name: "발표 예정", value: PresentationStatusType.SCHEDULED, imageSrc: "" },
  { name: "발표 완료", value: PresentationStatusType.FINISHED, imageSrc: "" },
  { name: "발표 취소", value: PresentationStatusType.CANCLED, imageSrc: "" },
];

const EditStatusModal = ({
  //   onClickProceed,
  closeModal,
}: EditStatusModalProps) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [newPresentationStatusType, setNewPresentationStatusType] =
    useState<PresentationStatusType>(PresentationStatusType.SCHEDULED);

  const tryEditPresentationStatus = async (e: React.MouseEvent) => {
    try {
      // await onClickProceed(e);
      setModalTitle("수정이 완료되었습니다");
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const handleDropdownChange = (val: PresentationStatusType) => {
    setNewPresentationStatusType(val);
  };

  const STATUS_DROPDOWN_PROPS = {
    options: STATUS_OPTIONS,
    defaultValue: STATUS_OPTIONS[0].name,
    defaultImageSrc: STATUS_OPTIONS[0].imageSrc,
    onChangeValue: handleDropdownChange,
  };

  const modalContents: IModalContents = {
    type: "hasProceedBtn",
    title: "일정 관리",
    iconType: IconType.CHECKICON,
    proceedBtnText: "수정",
    onClickProceed: tryEditPresentationStatus,
    closeModal: closeModal,
    renderAdditionalComponent: () => <Dropdown {...STATUS_DROPDOWN_PROPS} />,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={modalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal modalTitle={modalTitle} closeModal={closeModal} />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default EditStatusModal;
