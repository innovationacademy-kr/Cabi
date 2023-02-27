import {
  axiosUpdateCabinetMemo,
  axiosUpdateCabinetTitle,
} from "@/api/axios/axios.custom";
import {
  myCabinetInfoState,
  currentFloorCabinetState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import {
  CabinetInfo,
  CabinetInfoByLocationFloorDto,
  MyCabinetInfoResponseDto,
} from "@/types/dto/cabinet.dto";
import React from "react";
import { useRecoilState } from "recoil";
import StatusModal from "@/components/Modals/StatusModal/StatusModal";

const StatusModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [currentFloorCabinet, setCurrentFloorCabinet] = useRecoilState(
    currentFloorCabinetState
  );
  const statusModalProps = {
    cabinetType: targetCabinetInfo.lent_type,
    cabinetStatus: targetCabinetInfo.status,
  };
  //   const updateCabinetTitleInList = (newTitle: string | null) => {
  //     const updatedCabinetList: CabinetInfoByLocationFloorDto[] = JSON.parse(
  //       JSON.stringify(currentFloorCabinet)
  //     );
  //     const targetSectionCabinetList = updatedCabinetList.find(
  //       (floor) => floor.section === myCabinetInfo.section
  //     )?.cabinets;
  //     if (targetSectionCabinetList === undefined) return;

  //     let targetCabinet = targetSectionCabinetList.find(
  //       (section) => section.cabinet_id === myCabinetInfo.cabinet_id
  //     );

  //     targetCabinet!.cabinet_title = newTitle;
  //     setCurrentFloorCabinet(updatedCabinetList);
  //   };

  //   const onSaveEditMemo = (newTitle: string | null, newMemo: string) => {
  //     if (newTitle !== myCabinetInfo.cabinet_title) {
  //       //수정사항이 있으면
  //       axiosUpdateCabinetTitle({ cabinet_title: newTitle ?? "" })
  //         .then(() => {
  //           setMyCabinetInfo({
  //             ...myCabinetInfo,
  //             cabinet_title: newTitle,
  //             cabinet_memo: newMemo,
  //           });
  //           // list에서 제목 업데이트
  //           updateCabinetTitleInList(newTitle);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //     if (newMemo !== myCabinetInfo.cabinet_memo) {
  //       axiosUpdateCabinetMemo({ cabinet_memo: newMemo })
  //         .then(() => {
  //           setMyCabinetInfo({
  //             ...myCabinetInfo,
  //             cabinet_title: newTitle,
  //             cabinet_memo: newMemo,
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   };
  return (
    <StatusModal
      statusModalObj={statusModalProps}
      onClose={props.onClose}
      onSave={() => {}}
    />
  );
};

export default StatusModalContainer;
