import { useEffect, useState } from "react";
import IconType from "@/types/enum/icon.type.enum";
import { IModalContents } from "../Modals/Modal";
import ModalPortal from "../Modals/ModalPortal";
import ModifyClubPwModal from "../Modals/PasswordCheckModal/ModifiyClubPwModal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "../Modals/ResponseModal/ResponseModal";

const ClubPasswordModal = ({
  password,
  setPassword,
  isModalOpenTest,
  setIsModalOpenTest,
}: {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  isModalOpenTest: boolean;
  setIsModalOpenTest: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("비번모달테스트");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tmpPw, setTmpPw] = useState<string>("");

  const closeModal = () => {
    setIsModalOpenTest(false);
  };

  useEffect(() => {
    setTmpPw(password);
  }, [isModalOpenTest]);

  const onSendPassword = () => {
    setPassword(tmpPw);
    closeModal();
  };

  const [testModal, setTestModal] = useState<IModalContents>({
    type: "hasProceedBtn",
    title: "비밀번호 설정",
    detail: `동아리 사물함 비밀번호를 설정해주세요`,
    proceedBtnText: `설정`,
    // onClickProceed: onSendPassword,
    closeModal: () => closeModal(),
    isLoading: isLoading,
    iconType: IconType.CHECKICON,
  });

  //   const onSendPassword = async () => {
  //     setIsLoading(true);
  //     try {
  //       await axiosSendCabinetPassword(password);
  //       //userCabinetId 세팅
  //       setMyInfo({ ...myInfo, cabinetId: null });
  //       setIsCurrentSectionRender(true);
  //       setModalTitle("반납되었습니다");
  //       // 캐비닛 상세정보 바꾸는 곳
  //       try {
  //         const { data } = await axiosCabinetById(currentCabinetId);
  //         setTargetCabinetInfo(data);
  //       } catch (error) {
  //         throw error;
  //       }
  //       try {
  //         const { data: myLentInfo } = await axiosMyLentInfo();
  //         setMyLentInfo(myLentInfo);
  //       } catch (error) {
  //         throw error;
  //       }
  //     } catch (error: any) {
  //       setModalTitle(error.response.data.message);
  //       throw error;
  //     } finally {
  //       setIsLoading(false);
  //       setShowResponseModal(true);
  //     }
  //   };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]{0,4}$/;
    if (!regex.test(e.target.value)) {
      e.target.value = tmpPw;
      return;
    }
    setTmpPw(e.target.value);
  };

  return (
    <>
      {isModalOpenTest && (
        <ModalPortal>
          {!showResponseModal && (
            <ModifyClubPwModal
              modalContents={testModal}
              password={password}
              tmpPw={tmpPw}
              onChange={onChange}
              onSendPassword={onSendPassword}
            />
          )}
          {showResponseModal &&
            (hasErrorOnResponse ? (
              <FailResponseModal
                modalTitle={modalTitle}
                closeModal={() => closeModal}
              />
            ) : (
              <SuccessResponseModal
                modalTitle={modalTitle}
                closeModal={() => closeModal}
              />
            ))}
        </ModalPortal>
      )}
    </>
  );
};

export default ClubPasswordModal;
