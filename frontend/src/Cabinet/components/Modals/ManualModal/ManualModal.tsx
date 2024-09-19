import React from "react";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { manualContentData, manualItemsData } from "@/Cabinet/assets/data/ManualContent";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { ReactComponent as MoveBtnImg } from "@/Cabinet/assets/images/moveButton.svg";
import ContentStatus from "@/Cabinet/types/enum/content.status.enum";

interface ModalProps {
  contentStatus: ContentStatus;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManualModal: React.FC<ModalProps> = ({
  contentStatus,
  setIsModalOpen,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<StoreItemType>(StoreItemType.EXTENSION);
  const contentData = manualContentData[contentStatus];

  const isCabinetType =
    contentStatus === ContentStatus.PRIVATE ||
    contentStatus === ContentStatus.SHARE ||
    contentStatus === ContentStatus.CLUB;

  const hasImage =
    contentStatus === ContentStatus.EXTENSION ||
    contentStatus === ContentStatus.PRIVATE ||
    contentStatus === ContentStatus.SHARE ||
    contentStatus === ContentStatus.CLUB;

  const handleIconClick = (index: StoreItemType) => {
    setSelectedItem(index);
  };

  const closeModal = () => {
    if (modalIsOpen) {
      setModalIsOpen(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 400);
    }
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalWrapper
        background={contentData.background}
        contentStatus={contentStatus}
        className={modalIsOpen ? "open" : "close"}
        onClick={handleWrapperClick}
      >
        <ModalContent contentStatus={contentStatus}>
          <CloseButton contentStatus={contentStatus} onClick={closeModal}>
            <MoveBtnImg className="moveButton" />
          </CloseButton>
          {hasImage && (
            <BasicInfo>
              <ContentImgStyled contentStatus={contentStatus}>
                {contentData.iconComponent && (
                  <contentData.iconComponent className="contentImg" />
                )}
              </ContentImgStyled>
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
          )}
          {contentStatus === ContentStatus.STORE && (
            <>
              <ItemContentsStyled>
                {Object.entries(manualItemsData).map(([key, item]) =>(
                  <ItemIconStyled
                  key={key}
                  onClick={() => handleIconClick(key as StoreItemType)}
                  className={selectedItem === key ? "selected" : ""}
                  color={contentData.pointColor}
                  >
                    <item.icon />
                  </ItemIconStyled>
                ))}
              </ItemContentsStyled>
              {manualItemsData[selectedItem].title}
              <ManualContentStyled color={contentData.pointColor}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: manualItemsData[selectedItem].content,
                  }}
                ></div>
                </ManualContentStyled>
            </>
          )}
          {contentStatus !== ContentStatus.STORE && (
            <>
              {contentData.contentTitle}
              <ManualContentStyled color={contentData.pointColor}>
                <div
                  dangerouslySetInnerHTML={{ __html: contentData.contentText }}
                ></div>
              </ManualContentStyled>
            </>
          )}
        </ModalContent>
      </ModalWrapper>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
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
}>`
  z-index: 999;
  &.open {
    animation: ${OpenModalAni} 0.4s ease-in-out;
  }

  &.close {
    animation: ${CloseModalAni} 0.4s ease-in-out;
  }
  transform-origin: center;
  position: fixed;
  bottom: 0;
  max-width: 1000px;
  min-width: 330px;
  width: 70%;
  height: 75%;
  overflow-y: auto;
  background: ${(props) => props.background};
  padding: 15px 70px;
  border-radius: 40px 40px 0 0;
  border: ${(props) =>
    props.contentStatus === ContentStatus.PENDING
      ? "5px double var(--sys-default-main-color)"
      : props.contentStatus === ContentStatus.IN_SESSION ||
        props.contentStatus === ContentStatus.COIN
      ? "5px solid var(--sys-default-main-color)"
      : "none"};
  box-shadow: ${(props) =>
    props.contentStatus === ContentStatus.PENDING &&
    "inset 0px 0px 0px 5px var(--bg-color);"};
  border-bottom: none;
  @media screen and (max-width: 700px) {
    width: 100%;
    padding: 30px 30px;
  }
`;

const ModalContent = styled.div<{
  contentStatus: ContentStatus;
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) =>
    props.contentStatus === ContentStatus.IN_SESSION ||
    props.contentStatus === ContentStatus.COIN
      ? "var(--sys-default-main-color)"
      : props.contentStatus === ContentStatus.EXTENSION
      ? "var(--normal-text-color)"
      : "var(--white-text-with-bg-color)"};
  font-size: 2.5rem;
  font-weight: bold;
  align-items: flex-start;
  @media screen and (max-width: 400px) {
    font-size: 1.5rem;
    .contentImg {
      width: 60px;
      height: 60px;
      margin-top: 10px;
    }
    svg {
      width: 60px;
      height: 60px;
    }
  }
  .moveButton {
    stroke: ${(props) =>
      props.contentStatus === ContentStatus.IN_SESSION ||
      props.contentStatus === ContentStatus.COIN
        ? "var(--sys-default-main-color)"
        : props.contentStatus === ContentStatus.EXTENSION
        ? "var(--normal-text-color)"
        : "var(--white-text-with-bg-color)"};
  }
`;

const CloseButton = styled.div<{
  contentStatus: ContentStatus;
}>`
  width: 80px;
  height: 40px;
  cursor: pointer;
  margin-bottom: 45px;
  align-self: flex-end;
  z-index: 1;
  transition: all 0.3s ease-in-out;
  text-align: right;
  svg {
    transform: scaleX(-1);
    stroke: ${(props) =>
      props.contentStatus === ContentStatus.IN_SESSION ||
      props.contentStatus === ContentStatus.COIN
        ? "var(--sys-default-main-color)"
        : props.contentStatus === ContentStatus.EXTENSION
        ? "var(--normal-text-color)"
        : "var(--bg-color)"};
  }
  :hover {
    transform: translateX(-16px);
  }
`;

const BasicInfo = styled.div`
  width: 100%;
  height: 80px;
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
  border: 1px solid var(--white-text-with-bg-color);
  border-radius: 15px;
  font-size: 0.875rem;
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
  border: 1px solid var(--white-text-with-bg-color);
  border-radius: 15px;
  font-size: 0.875rem;
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

const ManualContentStyled = styled.div<{
  color: string;
}>`
  margin: 40px 0 0 20px;
  font-size: 1.25rem;
  line-height: 1.7;
  font-weight: 350;
  strong {
    color: ${(props) => props.color};
  }
  a {
    font-weight: bold;
    color: ${(props) => props.color};
  }
  & > div {
    margin-bottom: 30px;
  }
  span {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 2.5;
  }
  div > div {
    margin-left: 24px;
  }
  @media screen and (max-width: 800px) {
    line-height: 1.7;
    font-size: 1.125rem;
    margin-left: 10px;
  }
  @media screen and (max-width: 400px) {
    line-height: 1.6;
    font-size: 0.875rem;
    margin-top: 20px;
    margin-left: 3px;
    span {
      font-size: 1.2rem;
    }
  }
`;

const ContentImgStyled = styled.div<{
  contentStatus: ContentStatus;
}>`
  width: 80px;
  height: 80px;
  display: flex;

  & > svg {
    width: 80px;
    height: 80px;

    & > path {
      stroke: ${(props) =>
        props.contentStatus === ContentStatus.EXTENSION
          ? "var(--normal-text-color)"
          : "var(--white-text-with-bg-color)"};
    }
  }
`;

const ItemContentsStyled = styled.div`
  width: 45%;
  height: 80px;
  display: flex;
  margin-bottom: 30px;
`;

const ItemIconStyled = styled.div<{
  color: string;
}>`
  width: 80px;
  height: 80px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.selected > svg {
    filter: drop-shadow(0px 6px 3px var(--hover-box-shadow-color));
    width: 80px;
    height: 80px;
    transform-origin: center;
    & > path {
      stroke: ${(props) => props.color};
    }
  }
  & > svg {
    width: 80px;
    height: 80px;
    cursor: pointer;
    transform-origin: center;
    & > path {
      transform: scale(2);
      stroke: var(--ref-purple-690);
    }

    &:hover {
      transition: all 0.5s ease;
      filter: drop-shadow(0px 6px 3px var(--hover-box-shadow-color));
      transform-origin: center;
      & > path {
        stroke: ${(props) => props.color};
      }
    }
  }
`;

export default ManualModal;
