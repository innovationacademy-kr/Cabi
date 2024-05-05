import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import CoinAnimation from "@/Cabinet/components/Store/CoinAnimation";
import useMenu from "@/Cabinet/hooks/useMenu";

const StoreCoinPick = () => {
  const { toggleStore } = useMenu();

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
        <CoinCheckButton onClick={() => toggleStore()}>
          동전 주우러가기
        </CoinCheckButton>
      </>
    </Card>
  );
};

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
  font-weight 500;
  width: 90%;
  margin: 14px;
  font-size: 1rem;
`;

export default StoreCoinPick;
