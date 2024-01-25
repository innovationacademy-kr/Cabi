import React, { useRef, useState } from "react";
import styled from "styled-components";
import Button from "@/components/Common/Button";
import ModalPortal from "@/components/Modals/ModalPortal";
import CabinetType from "@/types/enum/cabinet.type.enum";

export interface MemoModalTestInterface {
  // cabinetType: CabinetType;
  cabinetMemo: string | null;
}

interface MemoModalTestContainerInterface {
  memoModalObj: MemoModalTestInterface;
  onClose: React.MouseEventHandler;
  onSave: (newMemo: string | null) => void;
}

const MAX_INPUT_LENGTH = 10;

const MemoModalTest = ({
  memoModalObj,
  onClose,
  onSave,
}: MemoModalTestContainerInterface) => {
  const {cabinetMemo } = memoModalObj;
  const [mode, setMode] = useState<string>("read");
  const newMemo = useRef<HTMLInputElement>(null);
  const handleClickWriteMode = (e: any) => {
    setMode("write");
    if (newMemo.current) {
      newMemo.current.select();
    }
  };

  const handleClickSave = (e: React.MouseEvent) => {
    // console.log("hey");
    //사물함 제목, 사물함 비밀메모 update api 호출
    onClose(e);
    document.getElementById("unselect-input")?.focus();
    if (newMemo.current!.value) {
      onSave(newMemo.current!.value);
    } else {
      onSave(null);
    }
    setMode("read");
  };

  const [charCount, setCharCount] = useState<number>(
    cabinetMemo ? cabinetMemo.length : 0
  );

  const handleChange = () => {
    if (newMemo.current) {
      setCharCount(newMemo.current.value.length);
      if (charCount > 10) setCharCount(10);
    }
  };

  return (
    <ModalPortal>
      <BackgroundStyled onClick={onClose} />
      <ModalContainerStyled type={"confirm"}>
        <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
          수정하기
        </WriteModeButtonStyled>
        <H2Styled>메모 관리</H2Styled>
        <ContentSectionStyled>
          <ContentItemSectionStyled>
            <ContentItemWrapperStyled>
              <ContentItemTitleStyled>동아리 메모</ContentItemTitleStyled>
              <ContentItemInputStyled
                onChange={handleChange}
                placeholder={cabinetMemo ? cabinetMemo : ""}
                mode={mode}
                defaultValue={cabinetMemo ? cabinetMemo : ""}
                readOnly={mode === "read" ? true : false}
                ref={newMemo}
                maxLength={MAX_INPUT_LENGTH}
              ></ContentItemInputStyled>
            </ContentItemWrapperStyled>
            <ContentItemWrapperStyledBottom>
              {charCount <= 10 && (
                <LengthCount>
                  {charCount} / {MAX_INPUT_LENGTH}
                </LengthCount>
              )}
              {charCount > 10 && (
                <LengthCount>
                  {10} / {MAX_INPUT_LENGTH}
                </LengthCount>
              )}
            </ContentItemWrapperStyledBottom>
          </ContentItemSectionStyled>
        </ContentSectionStyled>
        <input id="unselect-input" readOnly style={{ height: 0, width: 0 }} />
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <Button
              onClick={(e) => {
                handleClickSave(e);
                // onClose;
                // console.log("hi");
              }}
              text="저장"
              theme="fill"
            />
          )}
          <Button
            onClick={
              mode === "read"
                ? onClose
                : () => {
                    setMode("read");
                    if (cabinetMemo) newMemo.current!.value = cabinetMemo;
                    // newMemo.current!.value = cabinetMemo;
                  }
            }
            text={mode === "read" ? "닫기" : "취소"}
            theme={mode === "read" ? "lightGrayLine" : "line"}
          />
        </ButtonWrapperStyled>
      </ModalContainerStyled>
    </ModalPortal>
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
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ContentItemWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
`;

const ContentItemTitleStyled = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 8px;
`;

const ContentItemInputStyled = styled.textarea<{
  mode: string;
}>`
  padding: 15px;
  border: 1px solid var(--line-color);
  height: 240px;
  border-radius: 10px;
  text-align: start;
  font-size: 1.125rem;
  color: black;
  overflow-y: auto;
  white-space: pre-wrap;

  cursor: ${({ mode }) => (mode === "read" ? "default" : "input")};
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
  font-size: 0.875rem;
  line-height: 17px;
  width: max-content;
  height: auto;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  color: var(--main-color);
  &:hover {
    opacity: 0.8;
  }
`;

const ButtonWrapperStyled = styled.div<{ mode: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentItemWrapperStyledBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;
const LengthCount = styled.span`
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-top: 0px;
  font-size: 16px;
`;

export default MemoModalTest;

//  메모 들여쓰기, 한/영 카운트 확인 폰트 확인
