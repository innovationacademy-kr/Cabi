import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { targetClubInfoState } from "@/recoil/atoms";
import ClubCabinetInfoCard from "@/components/Card/ClubCabinetInfoCard/ClubCabinetInfoCard";
import ClubNoticeCard from "@/components/Card/ClubNoticeCard/ClubNoticeCard";
import ClubPageModals from "@/components/Club/ClubPageModals";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import {
  ClubInfoResponseDto,
  ClubInfoResponseType,
} from "@/types/dto/club.dto";
import { axiosGetClubInfo } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubInfo = ({ clubId }: { clubId: number }) => {
  const [page, setPage] = useState<number>(0);
  const [clubInfo, setClubInfo] = useState<ClubInfoResponseType>(undefined);
  const setTargetClubInfo = useSetRecoilState(targetClubInfoState);

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
      const { data }: { data: ClubInfoResponseDto } = await axiosGetClubInfo(
        clubId,
        page,
        2
      );
      setTargetClubInfo({
        ...data,
        clubId,
      });
      setTimeout(() => {
        setClubInfo(data);
      }, 500);
    } catch {
      setTimeout(() => {
        setClubInfo(STATUS_400_BAD_REQUEST);
      }, 500);
    }
  };

  return (
    <>
      {clubInfo === undefined ? (
        <LoadingAnimation />
      ) : clubInfo === STATUS_400_BAD_REQUEST ? (
        <EmptyClubCabinetTextStyled>
          동아리 사물함이 없어요
        </EmptyClubCabinetTextStyled>
      ) : (
        <>
          <TitleStyled>동아리 정보</TitleStyled>
          <CardGridWrapper>
            <ClubCabinetInfoCard clubInfo={clubInfo} />
            <ClubNoticeCard clubId={clubId} notice={clubInfo.clubNotice} />
          </CardGridWrapper>
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
};

const EmptyClubCabinetTextStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  /* color: var(--gray-color); */
  /* margin-top: 20px; */
`;

const ClubInfoWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TitleStyled = styled.div`
  width: 80%;
  max-width: 720px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: bold;
`;

const CardGridWrapper = styled.div`
  display: grid;
  margin: 1rem 0 2rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: 350px 350px;
  grid-template-rows: 240px;
  grid-template-areas: "clubCabinetInfo clubNotice";

  @media screen and (max-width: 768px) {
    grid-template-columns: 350px;
    grid-template-rows: 240px 240px;
    grid-template-areas:
      "clubCabinetInfo"
      "clubNotice";
  }
`;

export default ClubInfo;
