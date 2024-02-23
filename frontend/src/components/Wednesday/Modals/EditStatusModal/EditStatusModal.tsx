import { useState } from "react";
import styled from "styled-components";
import Button from "@/components/Common/Button";
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

  return (
    <ModalPortal>
      {!showResponseModal && (
        <>
          <BackgroundStyled onClick={closeModal} />
          <ModalContainerStyled type={"confirm"}>
            <H2Styled>일정 관리</H2Styled>
            <ContentSectionStyled>
              <ContentItemSectionStyled>
                <ContentItemWrapperStyled isVisible={true}>
                  <ContentItemTitleStyled>발표 상태</ContentItemTitleStyled>

                  <Dropdown {...STATUS_DROPDOWN_PROPS} />
                </ContentItemWrapperStyled>
                <ContentItemWrapperStyled isVisible={true}>
                  <ContentItemTitleStyled>날짜</ContentItemTitleStyled>

                  <Dropdown {...STATUS_DROPDOWN_PROPS} />
                </ContentItemWrapperStyled>
              </ContentItemSectionStyled>
            </ContentSectionStyled>
            <ButtonWrapperStyled>
              <Button
                onClick={tryEditPresentationStatus}
                text="저장"
                theme="fill"
              />
              <Button onClick={closeModal} text={"취소"} theme={"line"} />
            </ButtonWrapperStyled>
          </ModalContainerStyled>
        </>
      )}
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

const DropdownWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;
const ModalContainerStyled = styled.div<{ type: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 360px;
  background: white;
  z-index: 1000;
  border-radius: 10px;
  transform: translate(-50%, -50%);
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 40px;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 25px 0px;
  white-space: break-spaces;
  text-align: start;
`;

const ContentSectionStyled = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const ContentItemSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentItemWrapperStyled = styled.div<{
  isVisible: boolean;
}>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default EditStatusModal;
