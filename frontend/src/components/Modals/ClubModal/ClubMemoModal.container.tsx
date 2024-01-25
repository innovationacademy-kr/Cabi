import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { currentFloorCabinetState, myCabinetInfoState } from "@/recoil/atoms";
import MemoModalTest from "./ClubMemoModal";

const MemoModalTestContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
  isModalOpen: boolean;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [] = useRecoilState(currentFloorCabinetState);

  const onSaveEditMemo = (newMemo: string | null) => {
    if (newMemo === props.text) newMemo = null;
  };
  return (
    <>
      {props.isModalOpen && (
        <MemoModalTest
          onClose={props.onClose}
          onSave={onSaveEditMemo}
          text={props.text}
          setText={props.setText}
        />
      )}
    </>
  );
};

export default MemoModalTestContainer;
