import { useEffect } from "react";
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
    if (clubId) {
      getClubInfo(clubId);
    }
  }, [clubId]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, page, 100);
      setClubInfo(result.data);
    } catch (error) {
      throw error;
    }
  };

  return <>{<ClubInfo clubInfo={clubInfo} />}</>;
};

export default ClubInfoContainer;
