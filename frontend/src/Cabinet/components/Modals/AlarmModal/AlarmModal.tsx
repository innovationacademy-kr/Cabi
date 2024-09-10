import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import IconType from "@/Cabinet/types/enum/icon.type.enum";

export const AlarmModal = ({
  title,
  detail,
  closeModal,
  iconType = IconType.NOTIFICATIONICON,
}: {
  title: string;
  detail: string;
  closeModal: React.MouseEventHandler;
  iconType?: IconType;
}) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    title: title,
    detail: detail,
    closeModal: closeModal,
    iconType: iconType,
  };
  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
