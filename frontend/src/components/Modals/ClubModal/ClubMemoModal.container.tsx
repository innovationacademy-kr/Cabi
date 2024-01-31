import React from "react";
import { useRecoilState } from "recoil";
import { currentFloorCabinetState, myCabinetInfoState } from "@/recoil/atoms";
import MemoModalTest from "./ClubMemoModal";

const MemoModalTestContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
  isModalOpen: boolean;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onSave: (newMemo: string | null) => void;
}) => {
  const [] = useRecoilState(currentFloorCabinetState);

  const onSaveEditMemo = (newMemo: string | null) => {
    if (newMemo !== props.text) {
      props.setText(newMemo ?? "");
    }
  };

  
  return (
    <>
      {props.isModalOpen && (
        <MemoModalTest
          onClose={props.onClose}
          onSave={props.onSave}
          text={props.text}
          setText={props.setText}
        />
      )}
    </>
  );
};

export default MemoModalTestContainer;
