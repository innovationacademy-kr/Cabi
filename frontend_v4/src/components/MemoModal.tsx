import MemoModalContainer, {
  MemoModalInterface,
} from "@/containers/MemoModalContainer";
import { myCabinetInfoState } from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import React from "react";
import { useRecoilValue } from "recoil";

const MemoModal = (props: { onClose: React.MouseEventHandler<Element> }) => {
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const memoModalProps = {
    cabinetTitle: myCabinetInfo.cabinet_title,
    cabinetMemo: myCabinetInfo.cabinet_memo,
  };
  return (
    <MemoModalContainer memoModalObj={memoModalProps} onClose={props.onClose} />
  );
};

export default MemoModal;
