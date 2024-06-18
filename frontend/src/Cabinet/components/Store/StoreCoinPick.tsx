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
    >
      <>
        <CoinAnimation />
        <CoinSummary>
          <p>누군가가 매일 흘리는 동전을 주워보세요💰</p>
          <p>동전은 하루에 한 번씩 주울 수 있습니다</p>
        </CoinSummary>
        <CoinCheckButton onClick={() => toggleStore()}>
          동전 주우러가기
        </CoinCheckButton>
      </>
    </Card>
  );
};

const CoinSummary = styled.div`
  background-color: var(--card-content-bg-color);
  font-size: var(--size-base);
  word-wrap: normal;
  width: 90%;
  margin: 5px;
  padding: 12px 20px;
  line-height: 1.4;
  border-radius: 10px;
`;

const CoinCheckButton = styled.button`
  font-weight: 500;
  width: 90%;
  margin: 8px 0 16px;
  font-size: 0.9rem;
`;

export default StoreCoinPick;
