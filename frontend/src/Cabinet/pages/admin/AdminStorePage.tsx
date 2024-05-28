import { useEffect } from "react";
import styled from "styled-components";
import StoreHalfPieChart from "@/Cabinet/components/AdminInfo/Chart/StoreHalfPieChart";
import { axiosCoinCollectStatistics } from "@/Cabinet/api/axios/axios.custom";

const mockData = [
  {
    coinCount: 5,
    userCount: 10,
  },
  {
    coinCount: 10, // 1 ~ 20회
    userCount: 20, // n 명
  },
  {
    coinCount: 15, // 1 ~ 20회
    userCount: 30, // n 명
  },
  {
    coinCount: 20, // 1 ~ 20회
    userCount: 40, // n 명
  },
];
// TODO : 작은 횟수부터 큰 횟수까지 차례대로 보내주는지 확인

const AdminStorePage = () => {
  const getCoinCollectData = async () => {
    const date = new Date();
    const response = axiosCoinCollectStatistics(date.getMonth() + 1);
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
          <H2styled>이번달 코인 통계</H2styled>
          <h3>5월</h3>
        </CoinCollectTitleWrapperStyled>
        <StoreHalfPieChart data={mockData} />
      </ContainerStyled>
      <ContainerStyled></ContainerStyled>
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
