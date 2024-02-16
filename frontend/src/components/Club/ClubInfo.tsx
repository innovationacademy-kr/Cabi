import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { userState } from "@/recoil/atoms";
import ClubCabinetInfoCard from "@/components/Card/ClubCabinetInfoCard/ClubCabinetInfoCard";
import ClubNoticeCard from "@/components/Card/ClubNoticeCard/ClubNoticeCard";
import ClubMemberListContainer from "@/components/Club/ClubMemberList/ClubMemberList.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import useClubInfo from "@/hooks/useClubInfo";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const ClubInfo = () => {
  const myInfo = useRecoilValue(userState);
  const { clubState, clubInfo, setPage } = useClubInfo();
  const [imMaster, setImMaster] = useState<boolean>(false);

  useEffect(() => {
    if (clubInfo && clubInfo !== STATUS_400_BAD_REQUEST) {
      let clubInfoTest = clubInfo as ClubInfoResponseDto;
      if (clubInfoTest.clubMaster.userName === myInfo.name) setImMaster(true);
    }
  }, [clubInfo]);

  return (
    <>
      {clubInfo === undefined ? (
        <LoadingAnimation />
      ) : clubInfo === STATUS_400_BAD_REQUEST ? (
        <EmptyClubCabinetTextStyled>
          동아리 사물함이 없어요
          <SadCcabiStyled>
            <img src="/src/assets/images/sadCcabi.png" />
          </SadCcabiStyled>
        </EmptyClubCabinetTextStyled>
      ) : (
        <ClubInfoWrapperStyled>
          <TitleStyled>동아리 정보</TitleStyled>
          <CardGridWrapper>
            <ClubCabinetInfoCard clubInfo={clubInfo} isMaster={imMaster} />
            <ClubNoticeCard notice={clubInfo.clubNotice} isMaster={imMaster} />
          </CardGridWrapper>
          <ClubMemberListContainer
            clubInfo={clubInfo}
            page={clubState.page}
            setPage={setPage}
          />
        </ClubInfoWrapperStyled>
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
  font-size: 1.125rem;
  color: var(--gray-500);
  /* margin-top: 20px; */
`;

const SadCcabiStyled = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;

  img {
    width: 30px;
    aspect-ratio: 1 / 1;
    margin-left: 8px;
  }
`;

const ClubInfoWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-top: 2rem;
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
