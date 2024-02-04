import { useEffect, useState } from "react";
import {
  ClubInfoResponseDto,
  ClubInfoResponseType,
  ClubPaginationResponseDto,
} from "@/types/dto/club.dto";
import { axiosGetClubInfo, axiosMyClubInfo } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";
import LoadingAnimation from "../Common/LoadingAnimation";
import MultiToggleSwitch2, { toggleItem } from "../Common/MultiToggleSwitch2";
import ClubCabinetInfo from "./ClubCabinetInfo";
import ClubPageModals from "./ClubPageModals";

export function ClubPageInfo({ clubId }: { clubId: number }) {
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseType>(undefined);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (clubId) {
      setPage(0);
      setClubInfo(undefined);
      getClubInfo();
    }
  }, [clubId]);

  useEffect(() => {
    if (clubId) {
      getClubInfo();
    }
  }, [page]);

  const getClubInfo = async () => {
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
      {clubInfo === undefined ? (
        <LoadingAnimation />
      ) : clubInfo === STATUS_400_BAD_REQUEST ? (
        <div>동아리 사물함이 없습니다</div>
      ) : (
        <>
          <ClubCabinetInfo clubInfo={clubInfo} clubId={clubId} page={page} />
          <ClubPageModals
            clubInfo={clubInfo}
            clubId={clubId}
            page={page}
            getClubInfo={getClubInfo}
            setPage={setPage}
          />
        </>
      )}
    </>
  );
}
// info
// detail
// memo
