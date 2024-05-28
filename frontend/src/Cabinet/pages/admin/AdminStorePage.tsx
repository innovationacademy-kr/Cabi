import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import PieChartCoin from "@/Cabinet/components/AdminInfo/Chart/PieChartCoin";
import StoreHalfPieChart from "@/Cabinet/components/AdminInfo/Chart/StoreHalfPieChart";
import { axiosCoinCollectStatistics } from "@/Cabinet/api/axios/axios.custom";

export interface ICoinCollectInfo {
  coinCount: number;
  userCount: number;
}

const mockData: ICoinCollectInfo[] = [
  {
    coinCount: 5,
    userCount: 10,
  },
  {
    coinCount: 10,
    userCount: 20,
  },
  {
    coinCount: 15,
    userCount: 30,
  },
  {
    coinCount: 20,
    userCount: 40,
  },
];
// TODO : 작은 횟수부터 큰 횟수까지 차례대로 보내주는지 확인

const PieChartCoinData = [
  {
    used: 70,
    unused: 50,
  },
];

const AdminStorePage = () => {
  const [coinCollectData, setCoinCollectData] = useState<ICoinCollectInfo[]>(
    []
  );

  const getCoinCollectData = async () => {
    try {
      const date = new Date();
      // TODO
      // const response = await axiosCoinCollectStatistics(date.getMonth() + 1);
      // setCoinCollectData(response.data.coinCollectStatistics);
      setCoinCollectData(mockData);
    } catch (error) {
      console.error("Error getting coin collect data:", error);
    }
  };

  useEffect(() => {
    getCoinCollectData();
  }, []);

  return (
    <AdminHomeStyled>
      <ContainerStyled></ContainerStyled>
      <ContainerStyled></ContainerStyled>
      <ContainerStyled></ContainerStyled>
      <ContainerStyled>
        <CoinCollectTitleWrapperStyled>
          <H2styled>코인 통계</H2styled>
          <h3>5월</h3>
        </CoinCollectTitleWrapperStyled>
        <StoreHalfPieChart data={coinCollectData} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>전체 재화 현황</H2styled>
        <PieChartCoin data={PieChartCoinData} />
      </ContainerStyled>
      <ContainerStyled></ContainerStyled>
    </AdminHomeStyled>
  );
};

const AdminHomeStyled = styled.div`
  background: var(--bg-color);
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
  }
`;

const ContainerStyled = styled.div`
  height: 90%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &:nth-child(4) {
    padding-bottom: 20px;
  }
  &:nth-child(5) {
    padding-bottom: 20px;
  }
  &:nth-child(6) {
    padding-bottom: 20px;
  }
  @media screen and (max-width: 1300px) {
    &:nth-child(1) {
      order: 6;
    }
    &:nth-child(2) {
      order: 5;
    }
    &:nth-child(3) {
      order: 4;
    }
    &:nth-child(4) {
      order: 3;
    }
    &:nth-child(5) {
      order: 2;
    }
    &:nth-child(6) {
      order: 1;
    }
  }
`;

const H2styled = styled.h2`
  font-size: 1.25rem;
  line-height: 2rem;
  text-align: center;
  font-weight: bold;
`;

const CoinCollectTitleWrapperStyled = styled.div`
  & > h3 {
    text-align: center;
    color: var(--ref-gray-400);
    font-weight: bold;
    margin-top: 10px;
  }
`;

export default AdminStorePage;
