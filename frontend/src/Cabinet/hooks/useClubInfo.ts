import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isCurrentSectionRenderState,
  targetClubCabinetInfoState,
  targetClubInfoState,
} from "@/Cabinet/recoil/atoms";
import {
  ClubInfoResponseDto,
  ClubInfoResponseType,
} from "@/Cabinet/types/dto/club.dto";
import { axiosGetClubInfo } from "@/Cabinet/api/axios/axios.custom";
import useMenu from "@/Cabinet/hooks/useMenu";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const useClubInfo = () => {
  const [clubState, setClubState] = useState({ clubId: 0, page: 0 });
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseType>(undefined);
  const [targetClubInfo, setTargetClubInfo] =
    useRecoilState(targetClubInfoState);
  const setTargetClubCabinetInfo = useSetRecoilState(
    targetClubCabinetInfoState
  );
  const [isCurrentSectionRender, setIsCurrentSectionRender] = useRecoilState(
    isCurrentSectionRenderState
  );
  const prevClubIdRef = useRef(targetClubInfo.clubId);
  const { closeClubMember } = useMenu();

  const setPage = (newPage: number) => {
    setClubState((prevState) => ({ ...prevState, page: newPage }));
  };

  const getClubInfo = async (clubId: number, page: number) => {
    try {
      const { data }: { data: ClubInfoResponseDto } = await axiosGetClubInfo(
        clubId,
        page,
        2
      );
      setTargetClubInfo({
        clubId,
        clubName: data.clubName,
        clubMaster: data.clubMaster.userName,
      });
      setTimeout(() => {
        setClubInfo(data);
        setTargetClubCabinetInfo({
          building: data.building,
          floor: data.floor,
          section: data.section,
          visibleNum: data.visibleNum,
        });
      }, 500);
    } catch {
      setTimeout(() => {
        setClubInfo(STATUS_400_BAD_REQUEST);
      }, 500);
    }
  };

  // NOTE: 컴포넌트가 마운트 될 때, targetClubInfo.clubId 혹은 isCurrentSectionRender 변경 시마다 실행됩니다.
  useEffect(() => {
    if (targetClubInfo.clubId !== clubState.clubId || isCurrentSectionRender) {
      closeClubMember;
      setIsCurrentSectionRender(false);
      setClubState({
        clubId: targetClubInfo.clubId,
        page: 0,
      });
      setClubInfo(undefined);
      getClubInfo(targetClubInfo.clubId, 0);
    }
    prevClubIdRef.current = targetClubInfo.clubId;
  }, [targetClubInfo.clubId, isCurrentSectionRender]);

  // NOTE: page가 변경되고 clubId는 변경되지 않았을 때 실행됩니다.
  useEffect(() => {
    if (clubState.page !== 0 && clubState.clubId === prevClubIdRef.current) {
      getClubInfo(clubState.clubId, clubState.page);
    }
  }, [clubState.page]);

  return { clubState, clubInfo, setPage };
};

export default useClubInfo;
