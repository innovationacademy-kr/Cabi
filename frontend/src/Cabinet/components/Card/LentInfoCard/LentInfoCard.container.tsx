import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { myCabinetInfoState, userState } from "@/Cabinet/recoil/atoms";
import LentInfoCard from "@/Cabinet/components/Card/LentInfoCard/LentInfoCard";
import { getDefaultCabinetInfo } from "@/Cabinet/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import { LentDto } from "@/Cabinet/types/dto/lent.dto";
import { IItemTimeRemaining } from "@/Cabinet/types/dto/store.dto";
import CabinetStatus from "@/Cabinet/types/enum/cabinet.status.enum";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";
import { getRemainingTime, getTimeRemaining } from "@/Cabinet/utils/dateUtils";

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
  status: CabinetStatus;
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

// NOTE: 내 이름을 볼드처리한 사용자 리스트를 반환
const getCabinetUserList = (
  selectedCabinetInfo: CabinetInfo,
  myName: string | null
): JSX.Element => {
  const { lents } = selectedCabinetInfo;
  if (!myName || !lents || lents.length === 0)
    return (
      <>
        <span style={{ fontWeight: "bold" }}>{myName}</span>
      </>
    );

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
  unbannedAt,
}: {
  name: string | null;
  unbannedAt: Date | null | undefined;
}) => {
  const myCabinetInfo = useRecoilValue(myCabinetInfoState);
  const [isPenaltyUser, setIsPenaltyUser] = useState(true);
  const [remainPenaltyPeriod, setRemainPenaltyPeriod] =
    useState<IItemTimeRemaining | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    userCount: myCabinetInfo ? myCabinetInfo.lents.length : 1,
    userNameList,
    dateUsed,
    dateLeft,
    expireDate,
    isLented: myCabinetInfo && myCabinetInfo.lents.length ? true : false,
    previousUserName: myCabinetInfo?.previousUserName || "",
    status: myCabinetInfo.status || "",
  };

  const onCLickPenaltyButton = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (unbannedAt == null) {
      setIsPenaltyUser(false);
    } else {
      setRemainPenaltyPeriod(getTimeRemaining(unbannedAt));
    }
  }, [unbannedAt]);

  return (
    <LentInfoCard
      cabinetInfo={cabinetLentInfo}
      unbannedAt={unbannedAt}
      button={
        isPenaltyUser
          ? {
              label: "페널티 감면",
              onClick: onCLickPenaltyButton,
              isClickable: true,
            }
          : undefined
      }
      isModalOpen={isModalOpen}
      remainPenaltyPeriod={remainPenaltyPeriod}
      onClose={handleCloseModal}
    />
  );
};

export default LentInfoCardContainer;
