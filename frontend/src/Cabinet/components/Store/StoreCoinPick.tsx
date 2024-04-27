import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import CoinAnimation from "@/Cabinet/components/Store/CoinAnimation";
import useMenu from "@/Cabinet/hooks/useMenu";

const StoreCoinPick = () => {
  // const clubList = useRecoilValue<ClubPaginationResponseDto>(myClubListState);
  const { openStore } = useMenu();
  const onClickCoinNav = () => {
    console.log("onClickCoinNav");
  };

  return (
    <Card
      title={"동전 줍기"}
      gridArea={"coinPick"}
      width={"340px"}
      height={"320px"}
      // buttons={[button]}
    >
      <>
        <CoinAnimation />
        <CoinSummary>
          <p>상점에 흘린 동점을 주워보세요!</p>
          <p> 매일 동전이 쏟아집니다💰</p>
        </CoinSummary>
        <CoinCheckButton onClick={() => openStore()}>
          동전 확인하기
        </CoinCheckButton>
      </>
    </Card>
  );
};

const HeaderStyled = styled.div`
  width: 80%;
  max-width: 1000px;
  border-bottom: 2px solid #d9d9d9;
  margin-bottom: 25px;
`;

const StoreTitleStyled = styled.div`
  margin-bottom: 20px;
  line-height: 1.1;
  // font-size: 3rem;
  font-size: 2.5rem;
  font-weight: 600;
`;

const CoinPickStyled = styled.div`
  width: 320px;
  height: 350px;
  background-color: var(--lightgray-color);
  border-radius: 10px;
  // background-color: var(--white);
`;

const CoinSummary = styled.div`
  background-color: var(--white);
  font-size: 1rem;
  width: 90%;
  margin: 5px;
  padding: 10px 20px;
  line-height: 1.4;
  border-radius: 10px;
`;

const CoinCheckButton = styled.button`
  width: 90%;
  margin: 10px;
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

export default StoreCoinPick;
