import { useEffect, useState } from "react";
import ClubInfo from "@/components/Club/ClubInfo";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import { axiosGetClubInfo } from "@/api/axios/axios.custom";

const ClubInfoContainer = ({ clubId }: { clubId: number | undefined }) => {
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseDto>();

  useEffect(() => {
    if (clubId) {
      getClubInfo(clubId);
    }
  }, [clubId]);

  const getClubInfo = async (clubId: number) => {
    try {
      const result = await axiosGetClubInfo(clubId, 0, 100);
      setClubInfo(result.data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <ClubInfo clubInfo={clubInfo} />
    </>
  );
};

export default ClubInfoContainer;
