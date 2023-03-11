import {
  axiosBundleUpdateCabinetStatus,
  axiosBundleUpdateCabinetType,
  axiosCabinetById,
  axiosGetBrokenCabinetList,
  axiosUpdateCabinetStatus,
  axiosUpdateCabinetType,
} from "@/api/axios/axios.custom";
import {
  brokenCabinetListState,
  currentCabinetIdState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import StatusModal from "@/components/Modals/StatusModal/StatusModal";
import CabinetType from "@/types/enum/cabinet.type.enum";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import useMultiSelect from "@/hooks/useMultiSelect";
import { handleBrokenCabinetList } from "@/components/AdminInfo/convertFunctions";

const StatusModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const { targetCabinetInfoList } = useMultiSelect();
  const setNumberOfAdminWork = useSetRecoilState(numberOfAdminWorkState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const currentCabinetId = useRecoilValue(currentCabinetIdState);

  const statusModalProps =
    targetCabinetInfoList.length !== 0
      ? {
          cabinetType: targetCabinetInfoList[0].lent_type,
          cabinetStatus: targetCabinetInfoList[0].status,
          warningNotificationObj: {
            isVisible: false,
            message: "",
          },
        }
      : {
          cabinetType: targetCabinetInfo.lent_type,
          cabinetStatus: targetCabinetInfo.status,
          warningNotificationObj: {
            isVisible: targetCabinetInfo.lent_info.length > 0,
            message: `사물함의 상태 또는 타입을 변경하려면
먼저 해당 사물함을 반납해야 합니다.`,
          },
        };
  const setBrokenCabinetList = useSetRecoilState(brokenCabinetListState);

  const onSaveEditStatus = (
    newCabinetType: CabinetType,
    newCabinetStatus: CabinetStatus
  ) => {
    const cabinetId = targetCabinetInfo.cabinet_id;
    const cabinetStatus = targetCabinetInfo.status;
    const cabinetType = targetCabinetInfo.lent_type;
    //type 수정 사항이 있으면 type변경 api 호출
    if (newCabinetType !== cabinetType) {
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
      axiosUpdateCabinetStatus(cabinetId, newCabinetStatus)
        .then(async () => {
          setIsCurrentSectionRender(true);
          setNumberOfAdminWork((prev) => prev + 1);
          try {
            const { data } = await axiosCabinetById(currentCabinetId);
            setTargetCabinetInfo(data);
            const cabinetList = await axiosGetBrokenCabinetList();
            setBrokenCabinetList(handleBrokenCabinetList(cabinetList));
          } catch (error) {
            throw error;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const onSaveEditBundleStatus = (
    newCabinetType: CabinetType,
    newCabinetStatus: CabinetStatus
  ) => {
    const cabinetStatus = targetCabinetInfoList[0].status;
    const cabinetType = targetCabinetInfoList[0].lent_type;
    const updateCabinetIdList = targetCabinetInfoList.map(
      (cabinet) => cabinet.cabinet_id
    );
    if (newCabinetType !== cabinetType) {
      axiosBundleUpdateCabinetType(updateCabinetIdList, newCabinetType)
        .then(async () => {
          setIsCurrentSectionRender(true);
          setNumberOfAdminWork((prev) => prev + 1);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // status 수정 사항이 있으면 status변경 api호출
    if (newCabinetStatus !== cabinetStatus) {
      axiosBundleUpdateCabinetStatus(updateCabinetIdList, newCabinetStatus)
        .then(async () => {
          setIsCurrentSectionRender(true);
          setNumberOfAdminWork((prev) => prev + 1);
          try {
            const cabinetList = await axiosGetBrokenCabinetList();
            setBrokenCabinetList(handleBrokenCabinetList(cabinetList));
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
      onSave={
        targetCabinetInfoList.length !== 0
          ? onSaveEditBundleStatus
          : onSaveEditStatus
      }
    />
  );
};

export default StatusModalContainer;
