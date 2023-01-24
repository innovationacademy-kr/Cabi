import {
  axiosUpdateCabinetMemo,
  axiosUpdateCabinetTitle,
} from "@/api/axios/axios.custom";
import MemoModal from "@/components/Modals/MemoModal/MemoModal";
import { myCabinetInfoState } from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import React from "react";
import { useRecoilState } from "recoil";

const MemoModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [myCabinetInfo, setMyCabinetInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const memoModalProps = {
    cabinetType: myCabinetInfo.lent_type,
    cabinetTitle: myCabinetInfo.cabinet_title,
    cabinetMemo: myCabinetInfo.cabinet_memo,
  };
  const onSaveEditMemo = (newTitle: string | null, newMemo: string) => {
    if (newTitle !== myCabinetInfo.cabinet_title) {
      //수정사항이 있으면
      axiosUpdateCabinetTitle({ cabinet_title: newTitle ?? "" })
        .then(() => {
          setMyCabinetInfo({
            ...myCabinetInfo,
            cabinet_title: newTitle,
            cabinet_memo: newMemo,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (newMemo !== myCabinetInfo.cabinet_memo) {
      axiosUpdateCabinetMemo({ cabinet_memo: newMemo })
        .then(() => {
          setMyCabinetInfo({
            ...myCabinetInfo,
            cabinet_title: newTitle,
            cabinet_memo: newMemo,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <MemoModal
      memoModalObj={memoModalProps}
      onClose={props.onClose}
      onSave={onSaveEditMemo}
    />
  );
};

export default MemoModalContainer;
