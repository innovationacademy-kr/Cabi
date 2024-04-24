import { useEffect } from "react";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import CoinAnimation from "@/Cabinet/components/Store/CoinAnimation";
import StoreCoinPick from "@/Cabinet/components/Store/StoreCoinPick";
import StoreItemCard from "../components/Card/StoreItemCard/StoreItemCard";

const StoreItems = {
  연장권: "Extension",
  알림권: "NotificationRegistration",
  패널티삭제권: "PenaltyReduction",
  이사하기: "Relocation",
};

export interface Item {
  ItemId: number;
  ItemName: string;
  ItemPrice: number;
  ItemType: string;
}
const StoreMainPage = () => {
  // const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);

  const buttonClick = () => {
    console.log("click");
  };

  const Items = {
    ItemId: 1,
    ItemName: "연장권",
    ItemPrice: 300,
    ItemType: "사물함을 연장 할 수 있는 연장권 설명 내용입니다.",
  };

  return (
    <WrapperStyled>
      <HeaderStyled>
        <StoreTitleStyled>까비 상점</StoreTitleStyled>
      </HeaderStyled>

      <StoreCoinGridWrapper>
        <StoreCoinPick />
        <StoreItemCard
          Item={Items}
          button={{
            label: "구매하기",
            onClick: buttonClick,
            isClickable: true,
          }}
        />
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
  grid-template-areas: "coinPick Extension lentInfo" // h: 163px h: 366px
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
  width: 8s0%;
  height: 100%;
`;

export default StoreMainPage;
