import { useRecoilValue } from "recoil";
import { myCabinetInfoState, targetUserInfoState } from "@/recoil/atoms";
import LentInfoCard from "@/components/Card/LentInfoCard/LentInfoCard";
import { getDefaultCabinetInfo } from "@/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
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
  status: string;
}

const getCabinetUserList = (selectedCabinetInfo: CabinetInfo): string => {
  const { lents } = selectedCabinetInfo;
  if (lents.length === 0) return "";
  return new Array(lents.length)
    .fill(null)
    .map((_, idx) => lents[idx])
    .map((info) => (info ? info.name : ""))
    .join(", ");
};

const LentInfoCardContainer = () => {
  const myCabinetInfo = useRecoilValue(myCabinetInfoState);
  const targetUserInfo = useRecoilValue(targetUserInfoState);

  const bannedAt = targetUserInfo ? !!targetUserInfo.bannedAt : false;
  const defaultCabinetInfo: CabinetInfo = getDefaultCabinetInfo();
  const cabinetLentInfo: MyCabinetInfo = myCabinetInfo
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
        status: myCabinetInfo.status,
      }
    : {
        floor: defaultCabinetInfo.floor,
        section: defaultCabinetInfo.section,
        cabinetId: defaultCabinetInfo.cabinetId,
        visibleNum: defaultCabinetInfo.visibleNum,
        lentType: defaultCabinetInfo.lentType,
        userCount: 0,
        userNameList: "",
        expireDate: undefined,
        isLented: false,
        previousUserName: "",
        status: defaultCabinetInfo.status,
      };

  return <LentInfoCard cabinetInfo={cabinetLentInfo} bannedAt={bannedAt} />;
};

export default LentInfoCardContainer;
