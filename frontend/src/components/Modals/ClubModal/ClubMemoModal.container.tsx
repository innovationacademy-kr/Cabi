import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import { axiosUpdateClubNotice } from "@/api/axios/axios.custom";
import ClubMemoModal from "./ClubMemoModal";

export interface MemoModalTestInterface {
  onClose: React.MouseEventHandler;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubNotice: string;
  showResponseModal: boolean;
  setMode: React.Dispatch<React.SetStateAction<string>>;
  newMemo: React.RefObject<HTMLTextAreaElement>;
  previousTextRef: React.MutableRefObject<string>;
  mode: string;
  handleClickWriteMode: (e: any) => void;
  handleChange: () => void;
  charCount: number;
  tryMemoRequest: () => Promise<void>;
  hasErrorOnResponse: boolean;
  modalContent: string;
  modalTitle: string;
}

export interface MemoModalTestContainerInterface {
  onClose: React.MouseEventHandler;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubNotice: string;
}

export const CLUB_MEMO_MAX_LENGTH = 100;

const ClubMemoModalContainer = ({
  onClose,
  text,
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
      if (charCount > CLUB_MEMO_MAX_LENGTH) setCharCount(CLUB_MEMO_MAX_LENGTH);
      setText(newMemo.current.value);
    }
  };

  return (
    <ClubMemoModal
      onClose={onClose}
      text={text}
      setText={setText}
      clubNotice={clubNotice}
      showResponseModal={showResponseModal}
      setMode={setMode}
      newMemo={newMemo}
      previousTextRef={previousTextRef}
      mode={mode}
      handleClickWriteMode={handleClickWriteMode}
      handleChange={handleChange}
      charCount={charCount}
      tryMemoRequest={tryMemoRequest}
      hasErrorOnResponse={hasErrorOnResponse}
      modalContent={modalContent}
      modalTitle={modalTitle}
    />
  );
};

export default ClubMemoModalContainer;
