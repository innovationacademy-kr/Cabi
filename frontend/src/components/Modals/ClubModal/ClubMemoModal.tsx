import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import Button from "@/components/Common/Button";
import { MemoModalTestContainerInterface } from "@/components/Modals/ClubModal/ClubMemoModal.container";
import ModalPortal from "@/components/Modals/ModalPortal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { axiosUpdateClubNotice } from "@/api/axios/axios.custom";

const MAX_INPUT_LENGTH = 100;

const ClubMemoModal = ({
  text,
  onClose,
  setText,
  clubNotice,
}: MemoModalTestContainerInterface) => {
  const [mode, setMode] = useState<string>("read");
  const newMemo = useRef<HTMLTextAreaElement>(null);
  const previousTextRef = useRef<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const { clubId } = useRecoilValue(targetClubInfoState);

  const handleClickWriteMode = (e: any) => {
    setMode("write");
    if (newMemo.current) {
      newMemo.current.select();
    }
  };

  const tryMemoRequest = async () => {
    setIsLoading(true);
    try {
      await axiosUpdateClubNotice(clubId, text);
      setIsCurrentSectionRender(true);
      setModalTitle("메모 수정 완료");
      // const result = await axiosGetClubInfo(clubId, page, 2);
    } catch (error: any) {
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setIsLoading(false);
      setShowResponseModal(true);
    }
  };
  // const handleClickSave = (e: React.MouseEvent) => {

  //   document.getElementById("unselect-input")?.focus();
  //   if (newMemo.current!.value) {
  //     onSave(newMemo.current!.value);
  //   } else {
  //     onSave(null);
  //   }
  //   setText(newMemo.current!.value); //새 메모 저장
  //   previousTextRef.current = newMemo.current!.value; //이전 메모 업데이트
  //   setMode("read");
  // };

  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    text ? setCharCount(text.length) : setCharCount(0);
  }, [text]);

  const handleChange = () => {
    if (newMemo.current) {
      setCharCount(newMemo.current.value.length);
      if (charCount > MAX_INPUT_LENGTH) setCharCount(MAX_INPUT_LENGTH);
      setText(newMemo.current.value);
    }
  };
  return (
    <ModalPortal>
      {!showResponseModal && (
        <>
          <BackgroundStyled
            onClick={(e) => {
              setMode("read");
              if (text) {
                if (text) newMemo.current!.value = text;
                setText(previousTextRef.current);
                newMemo.current!.value = previousTextRef.current;
              }
              onClose(e);
            }}
          />
          <ModalContainerStyled type={"confirm"}>
            <WriteModeButtonStyled mode={mode} onClick={handleClickWriteMode}>
              수정하기
            </WriteModeButtonStyled>
            <H2Styled>동아리 메모</H2Styled>
            <ContentSectionStyled>
              <ContentItemSectionStyled>
                <ContentItemWrapperStyled>
                  <ContentItemInputStyled
                    onChange={handleChange}
                    placeholder={clubNotice}
                    mode={mode}
                    defaultValue={clubNotice}
                    readOnly={mode === "read" ? true : false}
                    ref={newMemo}
                    maxLength={MAX_INPUT_LENGTH}
                  ></ContentItemInputStyled>
                  <ContentItemWrapperStyledBottomStyled>
                    {charCount <= MAX_INPUT_LENGTH && (
                      <LengthCountStyled>
                        {charCount} / {MAX_INPUT_LENGTH}
                      </LengthCountStyled>
                    )}
                    {charCount > MAX_INPUT_LENGTH && (
                      <LengthCountStyled>
                        {MAX_INPUT_LENGTH} / {MAX_INPUT_LENGTH}
                      </LengthCountStyled>
                    )}
                  </ContentItemWrapperStyledBottomStyled>
                </ContentItemWrapperStyled>
              </ContentItemSectionStyled>
            </ContentSectionStyled>
            <input
              id="unselect-input"
              readOnly
              style={{ height: 0, width: 0 }}
            />
            <ButtonWrapperStyled mode={mode}>
              {mode === "write" && (
                <Button
                  onClick={() => {
                    tryMemoRequest();
                  }}
                  text="저장"
                  theme="fill"
                />
              )}
              <Button
                onClick={(e) => {
                  setMode("read");
                  if (text) {
                    if (text) newMemo.current!.value = text;
                    setText(previousTextRef.current);
                    newMemo.current!.value = previousTextRef.current;
                  }
                  onClose(e);
                }}
                text={mode === "read" ? "닫기" : "취소"}
                theme={mode === "read" ? "lightGrayLine" : "line"}
              />
            </ButtonWrapperStyled>
          </ModalContainerStyled>
        </>
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle="메모 수정 실패"
            modalContents={modalContent}
            closeModal={onClose}
          />
        ) : (
          <SuccessResponseModal modalTitle={modalTitle} closeModal={onClose} />
        ))}
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

const ContentItemInputStyled = styled.textarea<{
  mode: string;
}>`
  padding: 15px;
  border: 1px solid var(--line-color);
  height: 160px;
  border-radius: 10px;
  text-align: start;
  font-size: 1.125rem;
  color: black;
  overflow-y: auto;
  word-break: break-all;
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

const ContentItemWrapperStyledBottomStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: 2px;
`;

const LengthCountStyled = styled.span`
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-top: 0px;
  font-size: 16px;
`;

export default ClubMemoModal;
