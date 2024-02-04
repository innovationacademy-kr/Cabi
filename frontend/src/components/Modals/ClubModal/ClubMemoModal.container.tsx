import React from "react";
import ClubMemoModal from "./ClubMemoModal";

export interface MemoModalTestInterface {
  cabinetMemo: string | null;
}

export interface MemoModalTestContainerInterface {
  onClose: React.MouseEventHandler;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubId: number;
  clubNotice: string;
  // page: number;
}

const ClubMemoModalContainer = ({
  onClose,
  text,
  setText,
  clubId,
  clubNotice,
}: // page,
MemoModalTestContainerInterface) => {
  return (
    <ClubMemoModal
      onClose={onClose}
      text={text}
      setText={setText}
      clubId={clubId}
      clubNotice={clubNotice}
      // page={page}
    />
  );
};

export default ClubMemoModalContainer;
