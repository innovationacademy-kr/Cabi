import React from "react";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { manualContentData } from "@/assets/data/ManualContent";
import ContentStatus from "@/types/enum/content.status.enum";

interface ModalProps {
  isOpen: boolean;
  contentStatus: ContentStatus;
  onClose: () => void;
}

const ManualModal: React.FC<ModalProps> = ({
  isOpen,
  contentStatus,
  onClose,
}) => {
  if (!isOpen) return null;
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(isOpen);
  const contentData = manualContentData[contentStatus];

  const isCabinetType =
    contentStatus === ContentStatus.PRIVATE ||
    contentStatus === ContentStatus.SHARE ||
    contentStatus === ContentStatus.CLUB;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setModalIsOpen(false);
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <ModalOverlay onClick={handleModalClick}>
      <ModalWrapper
        background={contentData.background}
        contentStatus={contentStatus}
        isOpen={modalIsOpen}
      >
        <ModalContent contentStatus={contentStatus}>
          <CloseButton contentStatus={contentStatus} onClick={closeModal}>
            <img src="/src/assets/images/moveButton.svg" alt="" />
          </CloseButton>
          <BasicInfo>
            <img className="contentImg" src={contentData.imagePath} alt="" />
            {isCabinetType && (
              <BoxInfoWrap>
                <BoxInfo1>
                  대여기간
                  <br />
                  <strong>{contentData.rentalPeriod} </strong>
                </BoxInfo1>
                <BoxInfo2>
                  사용인원
                  <br />
                  <strong>{contentData.capacity}</strong>
                </BoxInfo2>
              </BoxInfoWrap>
            )}
          </BasicInfo>
          {contentData.contentTitle}
          <ManualContentStyeld color={contentData.pointColor}>
            <div
              dangerouslySetInnerHTML={{ __html: contentData.contentText }}
            ></div>
          </ManualContentStyeld>
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 75px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const OpenModalAni = keyframes`
  from {
    transform: translateY(100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const CloseModalAni = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

const ModalWrapper = styled.div<{
  background: string;
  contentStatus: ContentStatus;
  isOpen: boolean;
}>`
  animation: ${(props) => (props.isOpen ? OpenModalAni : CloseModalAni)} 0.4s
    ease-in-out;
  transform-origin: center;
  position: fixed;
  bottom: 0;
  max-width: 1500px;
  width: 72%;
  height: 75%;
  background: ${(props) => props.background};
  padding: 40px 50px;
  border-radius: 40px 40px 0 0;
  border: ${(props) =>
    props.contentStatus === ContentStatus.PENDING
      ? "6px solid #9747FF"
      : "none"};
  border-bottom: none;
`;

const ModalContent = styled.div<{
  contentStatus: ContentStatus;
}>`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) =>
    props.contentStatus === ContentStatus.PENDING
      ? "var(--main-color)"
      : props.contentStatus === ContentStatus.EXTENSION
      ? "black"
      : "white"};
  font-size: 40px;
  font-weight: bold;
  align-items: flex-start;
  .contentImg {
    width: 80px;
    height: 80px;
    filter: ${(props) =>
      props.contentStatus === ContentStatus.EXTENSION
        ? "brightness(0)"
        : "brightness(100)"};
    background-color: ${(props) =>
      props.contentStatus === ContentStatus.PENDING
        ? "var(--main-color)"
        : "none"};
    border-radius: ${(props) =>
      props.contentStatus === ContentStatus.PENDING ? "50px" : "0px"};
  }
`;

const CloseButton = styled.div<{
  contentStatus: ContentStatus;
}>`
  width: 60px;
  height: 15px;
  cursor: pointer;
  margin-bottom: 40px;
  align-self: flex-end;
  img {
    filter: ${(props) =>
      props.contentStatus === ContentStatus.EXTENSION
        ? "brightness(0)"
        : props.contentStatus === ContentStatus.PENDING
        ? "none"
        : "brightness(100)"};
    transform: scaleX(-1);
  }
`;

const BasicInfo = styled.div`
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
`;

const BoxInfoWrap = styled.div`
  display: flex;
`;

const BoxInfo1 = styled.div`
  width: 100px;
  height: 80px;
  border: 1px solid white;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-self: flex-end;
  strong {
    margin-top: 10px;
  }
`;

const BoxInfo2 = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid white;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  margin-left: 10px;
  strong {
    margin-top: 10px;
  }
`;

const ManualContentStyeld = styled.div<{
  color: string;
}>`
  margin: 40px 0 0 10px;
  font-size: 20px;
  line-height: 1.9;
  font-weight: 350;
  strong {
    color: ${(props) => props.color};
  }
  a {
    font-weight: bold;
    color: ${(props) => props.color};
  }
`;

export default ManualModal;
