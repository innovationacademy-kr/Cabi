import React from "react";
import { useRecoilState } from "recoil";
import { currentFloorCabinetState, myCabinetInfoState } from "@/recoil/atoms";
import MemoModal from "@/components/Modals/MemoModal/MemoModal";
import {
  CabinetInfoByBuildingFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import {
  axiosUpdateCabinetMemo,
  axiosUpdateCabinetTitle,
} from "@/api/axios/axios.custom";

const MemoModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [myCabinetInfo, setMyCabinetInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [currentFloorCabinet, setCurrentFloorCabinet] = useRecoilState(
    currentFloorCabinetState
  );
  const memoModalProps = {
    cabinetType: myCabinetInfo.lentType,
    cabinetTitle: myCabinetInfo.title,
    cabinetMemo: myCabinetInfo.cabinet_memo,
  };

  const updateCabinetTitleInList = (newTitle: string | null) => {
    const updatedCabinetList: CabinetInfoByBuildingFloorDto[] = JSON.parse(
      JSON.stringify(currentFloorCabinet)
    );
    const targetSectionCabinetList = updatedCabinetList.find(
      (floor) => floor.section === myCabinetInfo.section
    )?.cabinets;
    if (targetSectionCabinetList === undefined) return;

    let targetCabinet = targetSectionCabinetList.find(
      (section) => section.cabinetId === myCabinetInfo.cabinetId
    );

    targetCabinet!.title = newTitle;
    setCurrentFloorCabinet(updatedCabinetList);
  };

  const onSaveEditMemo = (newTitle: string | null, newMemo: string) => {
    if (newTitle !== myCabinetInfo.title) {
      //수정사항이 있으면
      axiosUpdateCabinetTitle({ title: newTitle ?? "" })
        .then(() => {
          setMyCabinetInfo({
            ...myCabinetInfo,
            title: newTitle,
            cabinet_memo: newMemo,
          });
          // list에서 제목 업데이트
          updateCabinetTitleInList(newTitle);
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
            title: newTitle,
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
