import React from "react";
import { useRecoilState } from "recoil";
import { currentFloorCabinetState, myCabinetInfoState } from "@/recoil/atoms";
import MemoModal from "@/components/Modals/MemoModal/MemoModal";
import {
  CabinetInfoByBuildingFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import {
  axiosUpdateMyCabinetInfo, // axiosUpdateCabinetMemo,
  // axiosUpdateCabinetTitle,
} from "@/api/axios/axios.custom";
import MemoModalTest from "./MemoModalTest";

const MemoModalTestContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
  isModalOpen: boolean;
}) => {
  const [myCabinetInfo, setMyCabinetInfo] =
    useRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const [currentFloorCabinet, setCurrentFloorCabinet] = useRecoilState(
    currentFloorCabinetState
  );
  const memoModalProps = {
    cabinetType: myCabinetInfo.lentType,
    cabinetTitle: myCabinetInfo.title,
    cabinetMemo: myCabinetInfo.memo,
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

  const onSaveEditMemo = (newMemo: string | null) => {
    if (newMemo === myCabinetInfo.memo) newMemo = null;
    //수정사항이 있으면
    // axiosUpdateMyCabinetInfo( newMemo)
    //   .then(() => {
    //     setMyCabinetInfo({
    //       ...myCabinetInfo,
    //       memo: newMemo ?? myCabinetInfo.memo,
    //     });
    //     // list에서 제목 업데이트
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };
  return (
    <>
      {props.isModalOpen && (
        <MemoModalTest
          memoModalObj={memoModalProps}
          onClose={props.onClose}
          onSave={onSaveEditMemo}
        />
      )}
    </>
  );
};

export default MemoModalTestContainer;
