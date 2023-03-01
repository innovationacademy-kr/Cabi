import {
  axiosCabinetById,
  axiosUpdateCabinetStatus,
  axiosUpdateCabinetType,
} from "@/api/axios/axios.custom";
import {
  currentCabinetIdState,
  currentFloorCabinetState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import StatusModal from "@/components/Modals/StatusModal/StatusModal";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";

const StatusModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const [currentFloorCabinet, setCurrentFloorCabinet] = useRecoilState(
    currentFloorCabinetState
  );
  const setNumberOfAdminWork = useSetRecoilState(numberOfAdminWorkState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const currentCabinetId = useRecoilValue(currentCabinetIdState);
  const statusModalProps = {
    cabinetType: targetCabinetInfo.lent_type,
    cabinetStatus: targetCabinetInfo.status,
  };

  const onSaveEditStatus = (
    newCabinetType: CabinetType,
    newCabinetStatus: CabinetStatus
  ) => {
    const cabinetId = targetCabinetInfo.cabinet_id;
    const cabinetStatus = targetCabinetInfo.status;
    const cabinetType = targetCabinetInfo.lent_type;
    const isLent = targetCabinetInfo.lent_info.length > 0;
    //type 수정 사항이 있으면 type변경 api 호출
    if (newCabinetType !== cabinetType) {
      console.log(`changed from ${cabinetType} to ${newCabinetType}`);
      axiosUpdateCabinetType(cabinetId, newCabinetType)
        .then(async () => {
          setIsCurrentSectionRender(true);
          setNumberOfAdminWork((prev) => prev + 1);
          try {
            const { data } = await axiosCabinetById(currentCabinetId);
            setTargetCabinetInfo(data);
          } catch (error) {
            throw error;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // status 수정 사항이 있으면 status변경 api호출
    if (newCabinetStatus !== cabinetStatus) {
      console.log(
        `changed from ${targetCabinetInfo.status} to ${newCabinetStatus}`
      );
      axiosUpdateCabinetStatus(cabinetId, newCabinetStatus)
        .then(async () => {
          setIsCurrentSectionRender(true);
          setNumberOfAdminWork((prev) => prev + 1);
          try {
            const { data } = await axiosCabinetById(currentCabinetId);
            setTargetCabinetInfo(data);
          } catch (error) {
            throw error;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  return (
    <StatusModal
      statusModalObj={statusModalProps}
      onClose={props.onClose}
      onSave={onSaveEditStatus}
    />
  );
};

export default StatusModalContainer;
