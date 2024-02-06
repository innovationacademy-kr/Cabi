import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import ClubMemoModal from "@/components/Modals/ClubModal/ClubMemoModal";
import { axiosUpdateClubNotice } from "@/api/axios/axios.custom";

export const CLUB_MEMO_MAX_LENGTH = 100;
// TODO : 메모, 멤버 리렌더링 바로 되게
interface ClubMemoModalContainerInterface {
  onClose: React.MouseEventHandler;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubNotice: string;
}

export interface ClubMemoModalInterface {
  onClose: React.MouseEventHandler;
  clubNotice: string;
  showResponseModal: boolean;
  newMemo: React.RefObject<HTMLTextAreaElement>;
  mode: string;
  handleClickWriteMode: (e: any) => void;
  handleChange: () => void;
  charCount: number;
  tryMemoRequest: () => Promise<void>;
  hasErrorOnResponse: boolean;
  modalContent: string;
  modalTitle: string;
  onClick: (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => void;
}

const ClubMemoModalContainer = ({
  onClose,
  text,
  setText,
  clubNotice,
}: ClubMemoModalContainerInterface) => {
  const [mode, setMode] = useState<string>("read");
  const newMemo = useRef<HTMLTextAreaElement>(null);
  const previousTextRef = useRef<string>(text);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [hasErrorOnResponse, setHasErrorOnResponse] = useState<boolean>(false);
  const [showResponseModal, setShowResponseModal] = useState<boolean>(false);
  const { clubId } = useRecoilValue(targetClubInfoState);
  const [charCount, setCharCount] = useState<number>(0);

  const handleClickWriteMode = (e: any) => {
    setMode("write");
    if (newMemo.current) {
      newMemo.current.select();
    }
  };

  const tryMemoRequest = async () => {
    try {
      await axiosUpdateClubNotice(clubId, text);
      setIsCurrentSectionRender(true);
      setModalTitle("메모 수정 완료");
      // const result = await axiosGetClubInfo(clubId, page, 2);
    } catch (error: any) {
      setModalTitle("메모 수정 실패");
      setModalContent(error.response.data.message);
      setHasErrorOnResponse(true);
    } finally {
      setShowResponseModal(true);
    }
  };

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

  const onClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    setMode("read");
    if (text) {
      if (text) newMemo.current!.value = text;
      setText(previousTextRef.current);
      newMemo.current!.value = previousTextRef.current;
    }
    onClose(e);
  };

  return (
    <ClubMemoModal
      onClose={onClose}
      clubNotice={clubNotice}
      showResponseModal={showResponseModal}
      newMemo={newMemo}
      mode={mode}
      handleClickWriteMode={handleClickWriteMode}
      handleChange={handleChange}
      charCount={charCount}
      tryMemoRequest={tryMemoRequest}
      hasErrorOnResponse={hasErrorOnResponse}
      modalContent={modalContent}
      modalTitle={modalTitle}
      onClick={onClick}
    />
  );
};

export default ClubMemoModalContainer;
