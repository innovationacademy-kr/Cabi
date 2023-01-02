import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { myCabinetInfoState, targetCabinetInfoState } from "@/recoil/atoms";
import CabinetInfoAreaContainer, {
  ISelectedCabinetInfo,
} from "@/containers/CabinetInfoAreaContainer";
import { CabinetInfo, MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import useDetailInfo from "@/hooks/useDetailInfo";

const CabinetInfoArea = (): JSX.Element => {
  const targetCabinetInfo = useRecoilValue(targetCabinetInfoState);
  const myCabinetInfo =
    useRecoilValue<MyCabinetInfoResponseDto>(myCabinetInfoState);
  const isMyCabinet =
    targetCabinetInfo && myCabinetInfo
      ? myCabinetInfo.cabinet_id === targetCabinetInfo.cabinet_id
      : false;

  const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
    // 동아리 사물함인 경우 cabinet_title에 있는 동아리 이름 반환
    if (
      selectedCabinetInfo.lent_type === "CIRCLE" &&
      selectedCabinetInfo.cabinet_title
    )
      return selectedCabinetInfo.cabinet_title;

    // 그 외에는 유저리스트 반환
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
    // 밴, 고장 사물함
    if (
      selectedCabinetInfo.status === CabinetStatus.BANNED ||
      selectedCabinetInfo.status === CabinetStatus.BROKEN
    )
      return "사용 불가";
    // 동아리 사물함
    else if (selectedCabinetInfo.lent_type === "CIRCLE") return "동아리 사물함";
    // 사용 중 사물함
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
          ? `반납일이 ${-remainTime}일 지났습니다`
          : `반납일이 ${remainTime}일 남았습니다`;
      return remainTimeString;
      // 빈 사물함
    } else return null;
  };

  const getDetailMessageColor = (selectedCabinetInfo: CabinetInfo): string => {
    // 밴, 고장 사물함
    if (
      selectedCabinetInfo.status === CabinetStatus.BANNED ||
      selectedCabinetInfo.status === CabinetStatus.BROKEN
    )
      return "var(--expired)";
    // 사용 중 사물함
    else if (
      selectedCabinetInfo.status === CabinetStatus.SET_EXPIRE_FULL ||
      selectedCabinetInfo.status === CabinetStatus.EXPIRED
    ) {
      const nowDate = new Date();
      const expireTime = new Date(selectedCabinetInfo.lent_info[0].expire_time);
      const remainTime = Math.floor(
        (expireTime.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return remainTime < 0 ? "var(--expired)" : "var(--black)";
      // 빈 사물함
    } else return "var(--black)";
  };

  const cabinetViewData: ISelectedCabinetInfo | null = targetCabinetInfo
    ? {
        floor: targetCabinetInfo.floor,
        section: targetCabinetInfo.section,
        isMine: isMyCabinet,
        cabinetNum: targetCabinetInfo.cabinet_num,
        status: targetCabinetInfo.status,
        lentType: targetCabinetInfo.lent_type,
        userNameList: getCabinetUserList(targetCabinetInfo),
        expireDate: targetCabinetInfo.lent_info[0]?.expire_time,
        detailMessage: getDetailMessage(targetCabinetInfo),
        detailMessageColor: getDetailMessageColor(targetCabinetInfo),
      }
    : null;

  const { closeCabinet } = useDetailInfo();
  return (
    <CabinetInfoAreaContainer
      selectedCabinetInfo={cabinetViewData}
      closeCabinet={closeCabinet}
    />
  );
};

export default CabinetInfoArea;
