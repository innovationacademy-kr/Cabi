import { useEffect, useState } from "react";
import ClubInfo from "@/components/Club/ClubInfo";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import { axiosGetClubInfo } from "@/api/axios/axios.custom";

const ClubInfoContainer = ({
  clubId,
  page,
  clubInfo,
  setClubInfo,
}: {
  clubId: number;
  page: number;
  clubInfo: ClubInfoResponseDto;
  setClubInfo: React.Dispatch<React.SetStateAction<ClubInfoResponseDto>>;
}) => {
  useEffect(() => {
    // if (clubId) {
    //   getClubInfo(clubId);
    // }
    setClubInfo({
      clubName: "동아리",
      clubMaster: "jusohn",
      clubMemo: "1234",
      building: "새롬관",
      floor: 3,
      section: "Cluster X - 1",
      visibleNum: 23,
      clubUsers: [
        {
          userId: 2,
          userName: "jusohn",
        },
        {
          userId: 3,
          userName: "jeekim",
        },
        {
          userId: 4,
          userName: "miyu",
        },
      ],
      clubUserCount: 1,
    });
  }, [clubId]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, page, 100);
      setClubInfo(result.data);
    } catch (error) {
      throw error;
    }
  };

  return <>{/* <ClubInfo clubInfo={clubInfo} /> */}</>;
};

export default ClubInfoContainer;
