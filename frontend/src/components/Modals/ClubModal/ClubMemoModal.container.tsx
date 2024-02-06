import React from "react";
import ClubMemoModal from "./ClubMemoModal";

export interface MemoModalTestInterface {
  cabinetMemo: string | null;
}

export interface MemoModalTestContainerInterface {
  onClose: React.MouseEventHandler;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  clubNotice: string;
}

const ClubMemoModalContainer = ({
  onClose,
  text,
  setText,
  clubNotice,
}: MemoModalTestContainerInterface) => {
  return (
    <ClubMemoModal
      onClose={onClose}
      text={text}
      setText={setText}
      clubNotice={clubNotice}
    />
  );
};

export default ClubMemoModalContainer;
