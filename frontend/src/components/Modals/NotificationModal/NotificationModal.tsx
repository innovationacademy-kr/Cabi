import Modal, { IModalContents } from "@/components/Modals/Modal";
import ModalPortal from "@/components/Modals/ModalPortal";
import IconType from "@/types/enum/icon.type.enum";

export const NotificationModal = ({
  title,
  detail,
  closeModal,
}: {
  title: string;
  detail: string;
  closeModal: React.MouseEventHandler;
}) => {
  const modalContents: IModalContents = {
    type: "noBtn",
    title: title,
    detail: detail,
    closeModal: closeModal,
    iconType: IconType.NOTIFICATIONICON,
  };
  return (
    <ModalPortal>
      <Modal modalContents={modalContents} />
    </ModalPortal>
  );
};
