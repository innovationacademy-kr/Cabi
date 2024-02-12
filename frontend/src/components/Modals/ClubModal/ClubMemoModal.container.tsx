import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubInfoState,
} from "@/recoil/atoms";
import ModalPortal from "@/components//Modals/ModalPortal";
import ClubMemoModal from "@/components/Modals/ClubModal/ClubMemoModal";
import {
  FailResponseModal,
  SuccessResponseModal,
} from "@/components/Modals/ResponseModal/ResponseModal";
import { axiosUpdateClubNotice } from "@/api/axios/axios.custom";

export const CLUB_MEMO_MAX_LENGTH = 100;
interface ClubMemoModalContainerInterface {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubNotice: string;
  setShowMemoModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ClubMemoModalInterface {
  clubNotice: string;
  newMemo: React.RefObject<HTMLTextAreaElement>;
  mode: string;
  handleClickWriteMode: () => void;
  handleChange: () => void;
  charCount: number;
  tryMemoRequest: () => Promise<void>;
  onClick: () => void;
}

const ClubMemoModalContainer = ({
  text,
  setText,
  clubNotice,
  setShowMemoModal,
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

  const closeModal = () => {
    setShowMemoModal(false);
  };

  const handleClickWriteMode = () => {
    setMode("write");
    if (newMemo.current) {
      newMemo.current.select();
    }
  };

  const tryMemoRequest = async () => {
    try {
      await axiosUpdateClubNotice(clubId, text);
      setModalTitle("메모 수정 완료");
      setTimeout(() => {
        setIsCurrentSectionRender(true);
      }, 1000);
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

  const onClick = () => {
    setMode("read");
    if (text) {
      if (text) newMemo.current!.value = text;
      setText(previousTextRef.current);
      newMemo.current!.value = previousTextRef.current;
    }
    closeModal();
  };

  return (
    <ModalPortal>
      {!showResponseModal && (
        <ClubMemoModal
          clubNotice={clubNotice}
          newMemo={newMemo}
          mode={mode}
          handleClickWriteMode={handleClickWriteMode}
          handleChange={handleChange}
          charCount={charCount}
          tryMemoRequest={tryMemoRequest}
          onClick={onClick}
        />
      )}
      {showResponseModal &&
        (hasErrorOnResponse ? (
          <FailResponseModal
            modalTitle={modalTitle}
            modalContents={modalContent}
            closeModal={closeModal}
          />
        ) : (
          <SuccessResponseModal
            modalTitle={modalTitle}
            closeModal={closeModal}
          />
        ))}
    </ModalPortal>
  );
};

export default ClubMemoModalContainer;
