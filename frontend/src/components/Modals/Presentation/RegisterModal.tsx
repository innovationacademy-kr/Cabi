import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import IconType from "@/types/enum/icon.type.enum";
import { axiosPostPresentationForm } from "@/api/axios/axios.custom";
import Modal, { IModalContents } from "../Modal";

const RegisterModal = ({
  title,
  summary,
  content,
  date,
  time,
  toggleType,
  closeModal,
}: {
  title: string;
  summary: string;
  content: string;
  date: string;
  time: string;
  toggleType: string;
  closeModal: React.MouseEventHandler;
}) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const registerDetail = `발표를 신청한 후에는 내용 수정이 <strong>불가능</strong>합니다.
발표 날짜와 시간을 수정하고 싶으시다면
관리자에게 문의해주세요.
<strong>${date}</strong> 에 수요지식회 발표를 등록하시겠습니까?`;
  const navigate = useNavigate();

  // 신청한 후 내용 수정 불가
  // 신청한 후 시간, 날짜는 Admin 에게 연락해야 수정 가능
  // 발표 날짜를 보이게 해야 할까?

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
        navigate("/wed/home");
      }, 1500);
    } catch (error: any) {
      setModalTitle(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

  const swapModalContents: IModalContents = {
    type: "hasProceedBtn",
    title: "제출하기",
    detail: registerDetail,
    proceedBtnText: "네, 제출할게요",
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
            closeModal={() => {
              setShowResponseModal(false);
            }}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={() => {
              setShowResponseModal(false);
            }}
          />
        ))}
    </ModalPortal>
  );
};

export default RegisterModal;
