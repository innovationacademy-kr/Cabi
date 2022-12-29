import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { myCabinetInfoState, targetCabinetInfoState } from "@/recoil/atoms";
import CabinetInfoAreaContainer, {
  ISelectedCabinetInfo,
} from "@/containers/CabinetInfoAreaContainer";
import { CabinetInfo, MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { LentDto } from "@/types/dto/lent.dto";

const CabinetInfoArea = (): JSX.Element => {
  const targetCabinetInfo = useRecoilValue(targetCabinetInfoState);
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const isMyCabinet =
    targetCabinetInfo && myCabinetInfo
      ? myCabinetInfo.cabinet_id === targetCabinetInfo.cabinet_id
      : false;

  const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
    let userNameList: string = "";
    for (let i = 0; i < selectedCabinetInfo.max_user; i++) {
      const userName =
        i < selectedCabinetInfo.lent_info.length
          ? selectedCabinetInfo.lent_info[i].intra_id
          : "-";
      userNameList += userName;
      if (i !== selectedCabinetInfo.max_user - 1) userNameList += "\n";
    }
    return userNameList;
  };

  const getDetailMessage = (
    selectedCabinetInfo: CabinetInfo
  ): string | null => {
    if (
      selectedCabinetInfo.status === CabinetStatus.BANNED ||
      selectedCabinetInfo.status === CabinetStatus.BROKEN
    )
      return "사용 불가";
    else if (selectedCabinetInfo.lent_type === "CIRCLE") return "동아리 사물함";
    else if (
      selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_FULL ||
      selectedCabinetInfo.status === CabinetStatus.EXPIRED
    ) {
      const nowDate = new Date();
      const expireTime = new Date(selectedCabinetInfo.lent_info[0].expire_time);
      const remainTime = Math.floor(
        (expireTime.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const remainTimeString =
        remainTime < 0
          ? `반납일이 ${-remainTime}일 지났습니다.`
          : `반납일이 ${remainTime}일 남았습니다.`;
      return remainTimeString;
    } else return null;
  };

  const cabinetViewData: ISelectedCabinetInfo | null = targetCabinetInfo
    ? {
        // TODO: API 수정되면 실제 값으로 변경 - floor, section
        floor: 2,
        section: "Oasis",
        isMine: isMyCabinet,
        cabinetNum: targetCabinetInfo.cabinet_num,
        status: targetCabinetInfo.status,
        lentType: targetCabinetInfo.lent_type,
        userNameList: getCabinetUserList(targetCabinetInfo),
        expireDate: targetCabinetInfo.lent_info[0]?.expire_time,
        detailMessage: getDetailMessage(targetCabinetInfo),
        detailMessageColor: "var(--black)",
      }
    : null;
  return <CabinetInfoAreaContainer selectedCabinetInfo={cabinetViewData} />;
};

export default CabinetInfoArea;
