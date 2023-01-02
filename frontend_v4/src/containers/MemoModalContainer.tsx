import styled from "styled-components";
import checkIcon from "@/assets/images/checkIcon.svg";
import errorIcon from "@/assets/images/errorIcon.svg";
import ButtonContainer from "./ButtonContainer";
import exitButton from "@/assets/images/exitButton.svg";
import React, { useState } from "react";

export interface MemoModalInterface {
  cabinetTitle: string;
  cabinetMemo: string;
}
interface MemoModalContainerInterface {
  memoModalObj: MemoModalInterface;
  onClose: React.MouseEventHandler;
}
const MemoModalContainer = ({
  memoModalObj,
  onClose,
}: MemoModalContainerInterface) => {
  const { cabinetTitle, cabinetMemo } = memoModalObj;
  const [mode, setMode] = useState<string>("read");
  return (
    <>
      <BackgroundStyled />
      <ModalContainerStyled type={"confirm"}>
        <div>
          <WriteModeButtonStyled mode={mode}>수정하기</WriteModeButtonStyled>
        </div>
        <H2Styled>{"메모관리"}</H2Styled>
        <ContentSectionStyled>
          <ContentItemWrapperStyled>
            <ContentItemTitleStyled>사물함 이름</ContentItemTitleStyled>
            <ContentItemInputStyled content={cabinetTitle} />
          </ContentItemWrapperStyled>
          <ContentItemWrapperStyled>
            <ContentItemTitleStyled>비밀 메모</ContentItemTitleStyled>
            <ContentItemInputStyled content={cabinetMemo} />
          </ContentItemWrapperStyled>
        </ContentSectionStyled>
        <ButtonWrapperStyled>
          <ButtonContainer onClick={onClose} text="취소" theme="white" />
        </ButtonWrapperStyled>
      </ModalContainerStyled>
    </>
  );
};

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
  padding: 30px 0 10px 0;
  padding-bottom: ${({ type }) => (type === "error" ? 0 : "10px")};
`;

export const DetailStyled = styled.p`
  margin: 0 30px 30px 30px;
  line-height: 1.2em;
  white-space: break-spaces;
`;

const H2Styled = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0 30px 30px 30px;
  white-space: break-spaces;
`;

const ContentSectionStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentItemWrapperStyled = styled.div`
  display: block;
`;

const ContentItemTitleStyled = styled.h3``;
const ContentItemInputStyled = styled.input<{ content: string }>`
  placeholder: ${({ content }) => content};
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  zindex: 1000;
`;

const WriteModeButtonStyled = styled.button<{ mode: string }>`
  display: ${({ mode }) => (mode === "read" ? "block" : "none")};
  position: absolute;
  border: none;
  outline: none;
  background: none;
  top: 30px;
  right: 30px;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-color);
  &: hover {
    opacity: 0.8;
  }
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default MemoModalContainer;
