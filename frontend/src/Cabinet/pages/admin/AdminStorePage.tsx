import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import CoinFlow from "@/Cabinet/components/AdminInfo/Chart/CoinFlow";
import ItemBarChart, {
  IitemUseCountDto,
} from "@/Cabinet/components/AdminInfo/Chart/ItemBarChart";
import PieChartCoin from "@/Cabinet/components/AdminInfo/Chart/PieChartCoin";
import StoreHalfPieChart from "@/Cabinet/components/AdminInfo/Chart/StoreHalfPieChart";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import { CoinDateType, CoinFlowType } from "@/Cabinet/types/enum/store.enum";
import {
  axiosCoinCollectStatistics,
  axiosCoinUseStatistics,
} from "@/Cabinet/api/axios/axios.custom";
import { axiosStatisticsItem } from "@/Cabinet/api/axios/axios.custom";

export interface ICoinCollectInfo {
  coinCount: number;
  userCount: number;
}

export interface ICoinAmountDto {
  // date: Date;
  date: string;
  amount: number;
}

export interface ICoinStatisticsDto {
  issueCoin: ICoinAmountDto[];
  unusedCoin: ICoinAmountDto[];
  usedCoin: ICoinAmountDto[];
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

const itemCount: IitemUseCountDto[] = [
  { itemName: "연장권", itemDetails: "extension_31", useCount: 31 },
  { itemName: "연장권", itemDetails: "extension_15", useCount: 15 },
  { itemName: "연장권", itemDetails: "extension_3", useCount: 3 },
  { itemName: "알림권", itemDetails: "alram", useCount: 10 },
  { itemName: "이사권", itemDetails: "move", useCount: 10 },
  { itemName: "패널티 축소권", itemDetails: "penalty_31", useCount: 31 },
  { itemName: "패널티 축소권", itemDetails: "penalty_7", useCount: 7 },
  { itemName: "패널티 축소권", itemDetails: "penalty_3", useCount: 3 },
];
export interface ITotalCoinInfo {
  used: number;
  unused: number;
}

const PieChartCoinData = [
  {
    used: 70,
    unused: 50,
  },
];

const AdminStorePage = () => {
  const [toggleType, setToggleType] = useState<CoinDateType>(CoinDateType.DAY);
  const [coinToggleType, setCoinToggleType] = useState<CoinFlowType>(
    CoinFlowType.ISSUE
  );
  const [coinCollectData, setCoinCollectData] = useState<ICoinCollectInfo[]>(
    []
  );
  const [totalCoinData, setTotalCoinData] = useState<ITotalCoinInfo[]>([]);
  const [totalCoinUseData, setTotalCoinUseData] = useState<
    ICoinStatisticsDto | undefined
  >();
  const [totalItemData, setTotalItemData] = useState<IitemUseCountDto[]>([]);

  const dataToggleList: toggleItem[] = [
    { name: "발행 코인", key: CoinFlowType.ISSUE },
    { name: "미사용 코인", key: CoinFlowType.UNUSED },
    { name: "사용 코인", key: CoinFlowType.USED },
  ];

  const toggleList: toggleItem[] = [
    { name: "1d", key: CoinDateType.DAY },
    { name: "7d", key: CoinDateType.WEEK },
    { name: "30d", key: CoinDateType.MONTH },
  ];

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

  const getTotalCoinData = async () => {
    try {
      // const response = await axiosStatisticsItem();
      // setTotalCoinData(response.data.coinCollectStatistics);
      setTotalCoinData(PieChartCoinData);
    } catch (error) {
      console.error("Error getting total coin data:", error);
    }
  };

  const getTotalItemData = async () => {
    try {
      // const response = await axiosStatisticsTotalItemUse();
      // setTotalItemData(response.data.coinCollectStatistics);
      // setTotalItemData(itemCount);
    } catch (error) {
      console.error("Err or getting total coin data:", error);
    }
  };

  const getTotalCoinUseData = async () => {
    try {
      const response = await axiosCoinUseStatistics(
        new Date("2024 06 01"),
        new Date("2024 06 07")
      );
      setTotalCoinUseData(response.data);
      // setTotalItemData(itemCount);
    } catch (error) {
      console.error("Error getting total coin data:", error);
    }
  };

  useEffect(() => {
    getTotalCoinUseData();
    getCoinCollectData();
    getTotalCoinData();
    getTotalItemData();
  }, []);

  return (
    <AdminHomeStyled>
      <ContainerStyled>
        <HeaderStyled>
          <H2styled>재화 사용 통계</H2styled>
          <ToggleContainer>
            <MultiToggleSwitch
              initialState={coinToggleType}
              setState={setCoinToggleType}
              toggleList={dataToggleList}
            />
            <MultiToggleSwitch
              initialState={toggleType}
              setState={setToggleType}
              toggleList={toggleList}
            />
          </ToggleContainer>
        </HeaderStyled>
        <CoinFlow
          toggleType={toggleType}
          coinToggleType={coinToggleType}
          totalCoinUseData={totalCoinUseData}
        />
      </ContainerStyled>
      <ContainerStyled>
        <CoinCollectTitleWrapperStyled>
          <H2styled>코인 통계</H2styled>
          <h3>5월</h3>
        </CoinCollectTitleWrapperStyled>
        <StoreHalfPieChart data={coinCollectData} />
      </ContainerStyled>
      <ContainerStyled>
        <H2styled>전체 재화 현황</H2styled>
        <PieChartCoin data={totalCoinData} />
      </ContainerStyled>
      <ContainerStyled>
        <CoinCollectTitleWrapperStyled>
          <H2styled>아이템 통계</H2styled>
        </CoinCollectTitleWrapperStyled>
        <ItemBarChart data={totalItemData} />
      </ContainerStyled>
    </AdminHomeStyled>
  );
};

const HeaderStyled = styled.div`
  width: 90%;
  display: flex;
  margin-top: 60px;
  margin-left: 110px;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
`;

const ToggleContainer = styled.div`
  width: 90%;
  display: flex;
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const AdminHomeStyled = styled.div`
  background: var(--bg-color);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  min-height: 775px;
  & > :first-child {
    grid-column: span 3;
  }

  @media screen and (max-width: 1300px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 500px);
    overflow: scroll;
    & > :first-child {
      grid-column: span 2;
    }
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(6, 500px);
    min-width: 300px;
    overflow: scroll;
    & > :first-child {
      grid-column: span 1;
    }
  }
`;

const ContainerStyled = styled.div`
  height: 90%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: 10px;
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
