import { useEffect, useState } from "react";
import {
  ClubInfoResponseDto,
  ClubInfoResponseType,
  ClubListReponseType,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosGetClubInfo, axiosMyClubInfo } from "@/api/axios/axios.custom";
import MultiToggleSwitch2, { toggleItem } from "../Common/MultiToggleSwitch2";
import ClubPageModals from "./ClubPageModals";

export function ClubPageInfo() {
  // axios 연결되면 사라질것들
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseType>(undefined);
  const [toggleType, setToggleType] = useState<string>("");
  const [toggleList, setToggleList] = useState<toggleItem[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (parseInt(toggleType) > 0) {
      getClubInfo(parseInt(toggleType));
    }
  }, [toggleType]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, page, 2);
      // if (page > 0) {
      //   setClubInfo((prev) => {
      //     return {
      //       ...prev,
      //       clubUsers: [...prev.clubUsers, ...result.data.clubUsers],
      //     };
      //   });
      // } else
      setClubInfo(result.data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <ClubPageModals
        clubInfo={clubInfo}
        clubList={clubList}
        page={page}
        getClubInfo={getClubInfo}
        setPage={setPage}
      />
    </>
  );
}
