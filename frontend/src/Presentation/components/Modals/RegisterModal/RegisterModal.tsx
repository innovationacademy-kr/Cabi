import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal, { IModalContents } from "@/Cabinet/components/Modals/Modal";
import ModalPortal from "@/Cabinet/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/Cabinet/components/Modals/ResponseModal/ResponseModal";
import IconType from "@/Cabinet/types/enum/icon.type.enum";
import { axiosPostPresentationForm } from "@/Presentation/api/axios/axios.custom";

const RegisterModal = ({
  title,
  summary,
  content,
  date,
  time,
  toggleType,
  closeModal,
  setIsFinished,
}: {
  title: string;
  summary: string;
  content: string;
  date: string;
  time: string;
  toggleType: string;
  closeModal: React.MouseEventHandler;
  setIsFinished: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const registerDetail = `발표를 신청한 후에는 내용 수정이 <strong>불가능</strong>합니다.
발표 날짜와 시간을 수정하고 싶으시다면
Cabi 슬랙 채널로 문의해주세요.
<strong>${date}</strong> 에 수요지식회 발표를 신청하시겠습니까?`;

  const closeResponseModal = (e: React.MouseEvent) => {
    closeModal(e);
  };

  const tryRegister = async () => {
    try {
      const [month, day] = date.split("/");
      const data = new Date(
        Number(new Date().getFullYear()),
        Number(month) - 1,
        Number(day)
      );
      // NOTE: Date 객체의 시간은 UTC 기준이므로 한국 시간 (GMT + 9) 으로 변환, 이후 발표 시작 시간인 14시를 더해줌
      data.setHours(9 + 14);
      await axiosPostPresentationForm(
        title,
        summary,
        content,
        data,
        toggleType,
        `${time}`
      );

      setModalTitle("신청이 완료되었습니다");
      setTimeout(() => {
        navigate("/presentation/home");
      }, 1500);
      setIsFinished(true);
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: "신청하기",
    detail: registerDetail,
    proceedBtnText: "네, 신청할게요",
    onClickProceed: tryRegister,
    closeModal: closeModal,
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  };

  return (
    <ModalPortal>
      {!showResponseModal && <Modal modalContents={swapModalContents} />}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            closeModal={closeResponseModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={closeResponseModal}
          />
        ))}
    </ModalPortal>
  );
};

export default RegisterModal;
