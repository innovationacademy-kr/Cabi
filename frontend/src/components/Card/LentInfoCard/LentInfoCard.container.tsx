import { useRecoilValue } from "recoil";
import { myCabinetInfoState } from "@/recoil/atoms";
import LentInfoCard from "@/components/Card/LentInfoCard/LentInfoCard";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";

export interface MyCabinetInfo {
  floor: number;
  section: string;
  cabinetId: number;
  visibleNum: number;
  lentType: CabinetType;
  userCount: number;
  userNameList: string;
  expireDate?: Date;
  isLented: boolean;
  previousUserName: string;
}

const LentInfoCardContainer = () => {
  const myCabinetInfo = useRecoilValue(myCabinetInfoState);

  const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
    const { lents } = selectedCabinetInfo;
    // 동아리 사물함인 경우 cabinet_title 에 있는 동아리 이름 반환
    // if (lentType === "CLUB" && title) return TitleStyled;
    if (lents.length === 0) return "";
    // 그 외에는 유저리스트 반환
    return new Array(lents.length)
      .fill(null)
      .map((_, idx) => lents[idx])
      .map((info) => (info ? info.name : ""))
      .join(", ");
  };

  const cabinetLentInfo: MyCabinetInfo | null = myCabinetInfo
    ? {
        floor: myCabinetInfo.floor,
        section: myCabinetInfo.section,
        cabinetId: myCabinetInfo.cabinetId,
        visibleNum: myCabinetInfo.visibleNum,
        lentType: myCabinetInfo.lentType,
        userCount: myCabinetInfo.lents.length,
        userNameList: getCabinetUserList(myCabinetInfo),
        expireDate:
          myCabinetInfo.lents.length !== 0
            ? myCabinetInfo.lents[0].expiredAt
            : undefined,
        isLented: myCabinetInfo.lents.length !== 0,
        previousUserName: myCabinetInfo.previousUserName,
      }
    : null;

  return <LentInfoCard cabinetInfo={cabinetLentInfo} />;
};

export default LentInfoCardContainer;
