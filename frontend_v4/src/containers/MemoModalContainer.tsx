import styled from "styled-components";
import ButtonContainer from "./ButtonContainer";
import React, { useRef, useState } from "react";

export interface MemoModalInterface {
  cabinetType: string;
  cabinetTitle: string;
  cabinetMemo: string;
}
interface MemoModalContainerInterface {
  memoModalObj: MemoModalInterface;
  onClose: React.MouseEventHandler;
  onSave: (newTitle: string, newMemo: string) => void;
}
const MemoModalContainer = ({
  memoModalObj,
  onClose,
  onSave,
}: MemoModalContainerInterface) => {
  const { cabinetType, cabinetTitle, cabinetMemo } = memoModalObj;
  const [mode, setMode] = useState<string>("read");
  const newTitle = useRef<HTMLInputElement>(null);
  const newMemo = useRef<HTMLInputElement>(null);
  const handleClickWriteMode = (e: any) => {
    setMode("write");
  };
  const handleClickSave = (e: React.MouseEvent) => {
    //사물함 제목, 사물함 비밀메모 update api 호출
    // onClose(e);
    onSave(newTitle.current!.value, newMemo.current!.value);
    setMode("read");
  };
  return (
    <>
      <BackgroundStyled onClick={onClose} />
      <ModalContainerStyled type={"confirm"}>
        <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
          수정하기
        </WriteModeButtonStyled>
        <H2Styled>메모 관리</H2Styled>
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled isVisible={cabinetType === "SHARE"}>
              <ContentItemTitleStyled>사물함 이름</ContentItemTitleStyled>
              <ContentItemInputStyled
                placeholder={cabinetTitle}
                mode={mode}
                defaultValue={mode === "write" ? cabinetTitle : undefined}
                readOnly={mode === "read" ? true : false}
                ref={newTitle}
              />
            </ContentItemWrapperStyled>
            <ContentItemWrapperStyled isVisible={true}>
              <ContentItemTitleStyled>비밀 메모</ContentItemTitleStyled>
              <ContentItemInputStyled
                placeholder={cabinetMemo}
                mode={mode}
                defaultValue={mode === "write" ? cabinetMemo : undefined}
                readOnly={mode === "read" ? true : false}
                ref={newMemo}
              />
            </ContentItemWrapperStyled>
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <ButtonContainer
              onClick={handleClickSave}
              text="저장"
              theme="fill"
            />
          )}
          <ButtonContainer
            onClick={
              mode === "read"
                ? onClose
                : () => {
                    setMode("read");
                    newTitle.current!.value = cabinetTitle;
                    newMemo.current!.value = cabinetMemo;
                  }
            }
            text={mode === "read" ? "닫기" : "취소"}
            theme={mode === "read" ? "grayLine" : "line"}
          />
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
  padding: 40px;
`;

export const DetailStyled = styled.p`
  margin: 0 30px 30px 30px;
  line-height: 1.2em;
  white-space: break-spaces;
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

const ContentItemWrapperStyled = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 25px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 18px;
  margin-bottom: 8px;
`;
const ContentItemInputStyled = styled.input<{
  mode: string;
}>`
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  text-indent: 20px;
  font-size: 18px;
  color: ${({ mode }) => (mode === "read" ? "var(--main-color)" : "black")};
  &::placeholder {
    color: ${({ mode }) =>
      mode === "read" ? "var(--main-color)" : "var(--line-color)"};
  }
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

const WriteModeButtonStyled = styled.button<{ mode: string }>`
  display: ${({ mode }) => (mode === "read" ? "block" : "none")};
  position: absolute;
  right: 40px;
  padding: 0;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  width: max-content;
  height: auto;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-color);
  &: hover {
    opacity: 0.8;
  }
`;

const ButtonWrapperStyled = styled.div<{ mode: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ mode }) => (mode === "read" ? "75px" : "0")};
`;

export default MemoModalContainer;
