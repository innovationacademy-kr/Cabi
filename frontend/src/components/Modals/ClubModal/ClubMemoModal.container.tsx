import React from "react";
import ClubMemoModal from "./ClubMemoModal";

const ClubMemoModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
  isModalOpen: boolean;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onSave: (newMemo: string | null) => void;
  clubId: number;
  clubNotice: string;
  page: number;
}) => {
  return (
    <>
      {props.isModalOpen && (
        <ClubMemoModal
          onClose={props.onClose}
          onSave={props.onSave}
          text={props.text}
          setText={props.setText}
          clubId={props.clubId}
          clubNotice={props.clubNotice}
          page={props.page}
        />
      )}
    </>
  );
};

export default ClubMemoModalContainer;
