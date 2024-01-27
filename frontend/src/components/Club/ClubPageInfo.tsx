import { useEffect, useState } from "react";
import { isCurrentSectionRenderState } from "@/recoil/atoms";
import {
  ClubInfoResponseDto,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosGetClubInfo, axiosMyClubInfo } from "@/api/axios/axios.custom";
import MultiToggleSwitch2, { toggleItem } from "../Common/MultiToggleSwitch2";
import ClubPageModals from "./ClubPageModals";

export function ClubPageInfo() {
  const [totalPage, setTotalPage] = useState<number>(1);
  // axios 연결되면 사라질것들
  const [clubList, setClubList] = useState<ClubPaginationResponseDto>({
    result: [
      {
        clubId: 0,
        clubName: "",
        clubMaster: "",
      },
    ],
    totalLength: 0, // totalLength : (지금은) 동아리 총 개수. 추후 바뀔수 있음
  });
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseDto>({
    clubName: "",
    clubMaster: "",
    clubMemo: "",
    building: "새롬관",
    floor: 3,
    section: "",
    visibleNum: 0,
    clubUsers: [
      {
        userId: 0,
        userName: "",
      },
    ],
    clubUserCount: 0,
  });
  const [toggleType, setToggleType] = useState<string>("");
  const [toggleList, setToggleList] = useState<toggleItem[]>([
    { name: "", key: "" },
  ]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    setToggleType(clubList?.result[0].clubId.toString());
    const clubToToggle = clubList.result.map((club) => {
      return {
        name: club.clubName.toString(),
        key: club.clubId.toString(),
      };
    });
    setToggleList(clubToToggle);
  }, [clubList]);

  useEffect(() => {
    if (parseInt(toggleType) > 0) {
      getClubInfo(parseInt(toggleType));
    }
  }, [toggleType]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, page, 100);
      setClubInfo(result.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getMyClubInfo();
  }, []);

  const getMyClubInfo = async () => {
    try {
      const response = await axiosMyClubInfo();
      const result = response.data.result;
      const totalLength = response.data.totalLength;
      setClubList({ result, totalLength });
      setTotalPage(totalLength);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <MultiToggleSwitch2
        initialState={toggleType}
        setState={setToggleType}
        toggleList={toggleList}
        setPage={setPage}
      />
      <ClubPageModals
        clubInfo={clubInfo}
        clubList={clubList}
        page={page}
        getClubInfo={getClubInfo}
      />
    </>
  );
}
