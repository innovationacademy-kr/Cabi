import styled from "styled-components";
import Button from "@/components/Common/Button";
import {
  CLUB_MEMO_MAX_LENGTH,
  ClubMemoModalInterface,
} from "@/components/Modals/ClubModal/ClubMemoModal.container";

const ClubMemoModal = ({
  clubNotice,
  newMemo,
  mode,
  handleClickWriteMode,
  handleChange,
  charCount,
  tryMemoRequest,
  onClick,
}: ClubMemoModalInterface) => {
  return (
    <>
      <BackgroundStyled onClick={onClick} />
      <ModalContainerStyled type={"confirm"}>
        <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
          수정하기
        </WriteModeButtonStyled>
        <H2Styled>동아리 메모</H2Styled>
        <ContentSectionStyled>
          <ContentItemTextAreaStyled
            onChange={handleChange}
            placeholder={clubNotice}
            mode={mode}
            defaultValue={clubNotice}
            readOnly={mode === "read" ? true : false}
            ref={newMemo}
            maxLength={CLUB_MEMO_MAX_LENGTH}
          />
          {mode === "write" ? (
            <ContentItemWrapperStyledBottomStyled>
              {charCount <= CLUB_MEMO_MAX_LENGTH && (
                <LengthCountStyled>
                  {charCount} / {CLUB_MEMO_MAX_LENGTH}
                </LengthCountStyled>
              )}
              {charCount > CLUB_MEMO_MAX_LENGTH && (
                <LengthCountStyled>
                  {CLUB_MEMO_MAX_LENGTH} / {CLUB_MEMO_MAX_LENGTH}
                </LengthCountStyled>
              )}
            </ContentItemWrapperStyledBottomStyled>
          ) : null}
        </ContentSectionStyled>
        <ButtonWrapperStyled mode={mode}>
          {mode === "write" && (
            <Button onClick={tryMemoRequest} text="저장" theme="fill" />
          )}
          <Button
            onClick={onClick}
            text={mode === "read" ? "닫기" : "취소"}
            theme={mode === "read" ? "lightGrayLine" : "line"}
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
  background: var(--color-background);
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
  justify-content: space-between;
  width: 100%;
  height: 200px;
  margin-bottom: 24px;
`;

const ContentItemTextAreaStyled = styled.textarea<{
  mode: string;
}>`
  box-sizing: border-box;
  padding: 15px;
  width: 100%;
  border: 1px solid var(--color-line);
  height: 100%;
  border-radius: 10px;
  font-size: 1.125rem;
  color: var(--color-text-normal);
  overflow-y: auto;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.2rem;
  letter-spacing: 0.8px;
  resize: none;

  cursor: ${({ mode }) => (mode === "read" ? "default" : "input")};
  color: ${({ mode }) =>
    mode === "read" ? "var(--main-color)" : "var(--color-text-normal)"};
  &::placeholder {
    color: ${({ mode }) =>
      mode === "read" ? "var(--main-color)" : "var(--color-line)"};
  }
  ::-webkit-scrollbar {
    width: 20px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-line);
    border-radius: 50px;
    border: 6px solid transparent;
    background-clip: padding-box;
    display: inline-block;
  }
`;

const BackgroundStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-shadow-100);
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

const ContentItemWrapperStyledBottomStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  height: 18px;
  line-height: 18px;
  margin-top: 4px;
`;

const LengthCountStyled = styled.span`
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  font-size: 14px;
  text-align: end;
`;

export default ClubMemoModal;
