import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  brokenCabinetListState,
  currentCabinetIdState,
  isCurrentSectionRenderState,
  numberOfAdminWorkState,
  targetCabinetInfoState,
} from "@/recoil/atoms";
import StatusModal from "@/components/Modals/StatusModal/StatusModal";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import {
  axiosCabinetById,
  axiosGetBrokenCabinetList, // axiosBundleUpdateCabinetStatus,
  // axiosBundleUpdateCabinetType,
  axiosUpdateCabinets,
} from "@/api/axios/axios.custom";
import useMultiSelect from "@/hooks/useMultiSelect";
import { handleBrokenCabinetList } from "@/utils/tableUtils";

const StatusModalContainer = (props: {
  onClose: React.MouseEventHandler<Element>;
}) => {
  const [targetCabinetInfo, setTargetCabinetInfo] = useRecoilState<CabinetInfo>(
    targetCabinetInfoState
  );
  const { targetCabinetInfoList, setTargetCabinetInfoList } = useMultiSelect();
  const setNumberOfAdminWork = useSetRecoilState(numberOfAdminWorkState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );
  const currentCabinetId = useRecoilValue(currentCabinetIdState);

  const statusModalProps =
    targetCabinetInfoList.length !== 0
      ? {
          cabinetType: targetCabinetInfoList[0].lentType,
          cabinetStatus: targetCabinetInfoList[0].status,
          warningNotificationObj: {
            isVisible: targetCabinetInfoList.find(
              (cabinet) => cabinet.userCount >= 1
            )
              ? true
              : false,
            message: `선택된 사물함중에 사용중인 사물함이
포함되어 있습니다.
사물함의 상태 또는 타입을 변경하려면 해당 사물함을 먼저 반납해주세요.`,
          },
        }
      : {
          cabinetType: targetCabinetInfo.lentType,
          cabinetStatus: targetCabinetInfo.status,
          warningNotificationObj: {
            isVisible: targetCabinetInfo.lents.length > 0,
            message: `사물함의 상태 또는 타입을 변경하려면
먼저 해당 사물함을 반납해야 합니다.`,
          },
        };
  const setBrokenCabinetList = useSetRecoilState(brokenCabinetListState);
  const buildNewCabinetInfoList = async () => {
    return await Promise.all(
      targetCabinetInfoList.map(async (cabinet) => {
        try {
          const { data } = await axiosCabinetById(cabinet.cabinetId);
          return data;
        } catch (error) {
          console.error(error);
        }
      })
    );
  };

  const onSaveEditStatus = (
    newCabinetType: CabinetType | null,
    newCabinetStatus: CabinetStatus | null
  ) => {
    const cabinetId = targetCabinetInfo.cabinetId;
    const cabinetStatus = targetCabinetInfo.status;
    const cabinetType = targetCabinetInfo.lentType;
    //type 수정 사항이 있으면 type변경 api 호출
    if (newCabinetType === cabinetType) newCabinetType = null;
    if (newCabinetStatus === cabinetStatus) newCabinetStatus = null;

    axiosUpdateCabinets([cabinetId], newCabinetType, newCabinetStatus)
      .then(async () => {
        setIsCurrentSectionRender(true);
        setNumberOfAdminWork((prev) => prev + 1);
        try {
          const { data } = await axiosCabinetById(currentCabinetId);
          setTargetCabinetInfo(data);
          if (newCabinetStatus === CabinetStatus.BROKEN) {
            const cabinetList = await axiosGetBrokenCabinetList();
            setBrokenCabinetList(handleBrokenCabinetList(cabinetList));
          }
        } catch (error) {
          throw error;
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const onSaveEditBundleStatus = (
    newCabinetType: CabinetType | null,
    newCabinetStatus: CabinetStatus | null
  ) => {
    const cabinetStatus = targetCabinetInfoList[0].status;
    const cabinetType = targetCabinetInfoList[0].lentType;
    const updateCabinetIdList = targetCabinetInfoList.map(
      (cabinet) => cabinet.cabinetId
    );
    if (newCabinetType === cabinetType) newCabinetType = null;
    if (newCabinetStatus === cabinetStatus) newCabinetStatus = null;

    axiosUpdateCabinets(updateCabinetIdList, newCabinetType, newCabinetStatus)
      .then(async () => {
        setIsCurrentSectionRender(true);
        setNumberOfAdminWork((prev) => prev + 1);
        if (newCabinetStatus === CabinetStatus.BROKEN) {
          try {
            const cabinetList = await axiosGetBrokenCabinetList();
            setBrokenCabinetList(handleBrokenCabinetList(cabinetList));
          } catch (error) {
            throw error;
          }
        }
      })
      .then(async () => {
        const ret = await buildNewCabinetInfoList();
        setTargetCabinetInfoList(ret);
      })
      .catch((error) => {
        console.log(error.message);
      });
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
