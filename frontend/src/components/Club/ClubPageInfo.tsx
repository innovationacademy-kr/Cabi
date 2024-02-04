import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubCabinetInfoCard from "@/components/Card/ClubCabinetInfoCard/ClubCabinetInfoCard";
import ClubCabinetInfo from "@/components/Club/ClubCabinetInfo";
import ClubPageModals from "@/components/Club/ClubPageModals";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { ClubInfoResponseType } from "@/types/dto/club.dto";
import { axiosGetClubInfo } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";
import ClubNoticeCard from "../Card/ClubNoticeCard/ClubNoticeCard";

const ClubPageInfo = ({ clubId }: { clubId: number }) => {
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
      setTimeout(() => {
        setClubInfo(result.data);
      }, 500);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      {clubInfo === undefined ? (
        <LoadingAnimation />
      ) : clubInfo === STATUS_400_BAD_REQUEST ? (
        <EmptyClubCabinetTextStyled>
          동아리 사물함이 없습니다
        </EmptyClubCabinetTextStyled>
      ) : (
        <>
          <ClubHeaderStyled>동아리 정보</ClubHeaderStyled>
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
  font-size: 1.5rem;
  /* color: var(--gray-color); */
  /* margin-top: 20px; */
`;

const ClubHeaderStyled = styled.div`
  width: 80%;
  display: flex;
  justify-content: flex-start;
  /* margin-left: 12rem; */
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: bold;
`;

const CardGridWrapper = styled.div`
  display: grid;
  padding: 1rem 0;
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

export default ClubPageInfo;
