import { useRecoilValue } from "recoil";
import { myCabinetInfoState, targetUserInfoState } from "@/recoil/atoms";
import LentInfoCard from "@/components/Card/LentInfoCard/LentInfoCard";
import { getDefaultCabinetInfo } from "@/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { LentDto } from "@/types/dto/lent.dto";
import CabinetType from "@/types/enum/cabinet.type.enum";
import { getRemainingTime } from "@/utils/dateUtils";

export interface MyCabinetInfo {
  name: string | null;
  floor: number;
  section: string;
  cabinetId: number;
  visibleNum: number;
  lentType: CabinetType;
  userCount: number;
  userNameList: JSX.Element;
  dateUsed?: number;
  dateLeft?: number;
  expireDate?: Date;
  isLented: boolean;
  previousUserName: string;
  status: string;
}

const findLentInfoByName = (lents: LentDto[], name: string) => {
  return lents.find((lent) => lent.name === name);
};

const calculateDateUsed = (startedAt: Date) => {
  const currentDate = new Date();
  const startDate = new Date(startedAt);
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getCabinetUserList = (
  selectedCabinetInfo: CabinetInfo,
  myName: string | null
): JSX.Element => {
  const { lents } = selectedCabinetInfo;
  if (!myName || !lents || lents.length === 0) return <></>;

  return (
    <>
      {lents.map((info, idx) => (
        <span
          key={idx}
          style={{ fontWeight: info.name === myName ? "bold" : "normal" }}
        >
          {info.name}
          {idx < lents.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
};

const LentInfoCardContainer = ({
  name,
  banned,
}: {
  name: string | null;
  banned: boolean;
}) => {
  const myCabinetInfo = useRecoilValue(myCabinetInfoState);

  let dateUsed, dateLeft, expireDate;
  if (name && myCabinetInfo.lents) {
    const lentInfo = findLentInfoByName(myCabinetInfo.lents, name);
    if (lentInfo) {
      dateUsed = calculateDateUsed(lentInfo.startedAt);
      dateLeft = getRemainingTime(lentInfo.expiredAt);
      expireDate = lentInfo.expiredAt;
    }
  }

  const cabinetInfoBase = myCabinetInfo.lents
    ? myCabinetInfo
    : getDefaultCabinetInfo();
  const userNameList = getCabinetUserList(myCabinetInfo, name);

  const cabinetLentInfo: MyCabinetInfo = {
    ...cabinetInfoBase,
    name,
    userCount: myCabinetInfo ? myCabinetInfo.lents.length : 0,
    userNameList,
    dateUsed,
    dateLeft,
    expireDate,
    isLented: myCabinetInfo && myCabinetInfo.lents.length ? true : false,
    previousUserName: myCabinetInfo?.previousUserName || "",
    status: myCabinetInfo.status || "",
  };

  return <LentInfoCard cabinetInfo={cabinetLentInfo} banned={banned} />;
};

export default LentInfoCardContainer;
