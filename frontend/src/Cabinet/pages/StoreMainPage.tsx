import { Container } from "@nivo/core";
import { useEffect } from "react";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import CoinAnimation from "@/Cabinet/components/Store/CoinAnimation";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";

const StoreItems = {
  연장권: "Extension",
  알림권: "NotificationRegistration",
  패널티삭제권: "PenaltyReduction",
  이사하기: "Relocation",
};

const StoreMainPage = () => {
  // const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);

  return (
    <WrapperStyled>
      <HeaderStyled>
        <StoreTitleStyled>까비 상점</StoreTitleStyled>
      </HeaderStyled>

      <StoreCoinGridWrapper>
        <StoreCoinPick />
      </StoreCoinGridWrapper>
    </WrapperStyled>
  );
};

const StoreTitleStyled = styled.div`
  margin-bottom: 20px;
  line-height: 1.1;
  // font-size: 3rem;
  font-size: 2.5rem;
  font-weight: 600;
`;

const StoreCoinGridWrapper = styled.div`
  display: grid;
  // padding: 60px 0;
  justify-content: center;
  align-items: center;
  width: 100%;
  grid-gap: 20px;
  grid-template-columns: 350px 350px 350px;
  grid-template-rows: 150px 150px;
  grid-template-areas: "coinPick lentInfo lentInfo" // h: 163px h: 366px
    "coinPick lentInfo lentInfo"; // h: 183px;
  // "theme notification"; // h: 230px h: 230px;

  @media (max-width: 768px) {
    grid-template-columns: 350px;
    grid-template-rows: 163px 366px 183px 230px 230px;
    grid-template-areas:
      "profile"
      "lentInfo"
      "extension"
      "theme"
      "notification";
  }

  // padding-top: 80px;
  // display: flex;
  // flex-direction: column;
  // justify-content: flex-start;
  // align-items: center;
  // width: 100%;
  // height: 100%;
`;

const HeaderStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 25px;
`;

const WrapperStyled = styled.div`
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default StoreMainPage;
