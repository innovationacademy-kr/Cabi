import styled from "styled-components";
import CoinFlow from "@/Cabinet/components/AdminInfo/Chart/CoinFlow";

const AdminCoinStatisticsPage = () => {
  return (
    <AdminCoinStatisticsStyled>
      <CoinFlowStyled>
        <H2styled>Coin Flow</H2styled>
        <CoinFlow />
      </CoinFlowStyled>
    </AdminCoinStatisticsStyled>
  );
};

const CoinFlowStyled = styled.div``;

const AdminCoinStatisticsStyled = styled.div`
  /* background: var(--bg-color);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  min-height: 775px;

  @media screen and (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 500px);
    overflow: scroll;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 500px);
    min-width: 300px;
    overflow: scroll;
  } */
`;

const H2styled = styled.h2`
  font-size: 1.25rem;
  line-height: 2rem;
  text-align: center;
  font-weight: bold;
`;

export default AdminCoinStatisticsPage;
