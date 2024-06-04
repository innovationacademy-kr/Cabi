import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import CoinFlow from "@/Cabinet/components/AdminInfo/Chart/CoinFlow";
import ItemBarChart, {
  IItemUseCountDto,
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
  axiosStatisticsTotalItemUse,
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
  issuedCoin: ICoinAmountDto[];
  // unusedCoin: ICoinAmountDto[];
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

// 아이템 통계 그래프 확인용
const itemList: IItemUseCountDto[] = [
  { itemName: "연장권", itemDetails: "출석 연장권 보상", userCount: 38 },
  { itemName: "연장권", itemDetails: "31일", userCount: 53 },
  { itemName: "연장권", itemDetails: "15일", userCount: 22 },
  { itemName: "연장권", itemDetails: "3일", userCount: 30 },
  { itemName: "페널티 감면권", itemDetails: "31일", userCount: 10 },
  { itemName: "페널티 감면권", itemDetails: "7일", userCount: 30 },
  { itemName: "페널티 감면권", itemDetails: "3일", userCount: 80 },
  { itemName: "이사권", itemDetails: "이사권", userCount: 60 },
  { itemName: "알림 등록권", itemDetails: "알림 등록권", userCount: 100 },
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
  const [totalItemData, setTotalItemData] = useState<IItemUseCountDto[]>([]);

  const dataToggleList: toggleItem[] = [
    { name: "발행 코인", key: CoinFlowType.ISSUE },
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
      const response = await axiosStatisticsTotalItemUse();
      setTotalItemData(response.data.items);
      // setTotalItemData(itemList);
    } catch (error) {
      console.error("Err or getting total coin data:", error);
    }
  };

  const getTotalCoinUseData = async (startDate: Date, endDate: Date) => {
    try {
      const response = await axiosCoinUseStatistics(startDate, endDate);
      setTotalCoinUseData(response.data);
    } catch (error) {
      console.error("Error getting total item data:", error);
    }
  };

  useEffect(() => {
    const startDate = new Date();
    let endDate;

    switch (toggleType) {
      case "DAY":
        endDate = new Date();
        endDate.setDate(startDate.getDate() - 7);
        break;
      case "WEEK":
        endDate = new Date();
        endDate.setDate(startDate.getDate() - 28); // 4주 = 28일
        break;
      case "MONTH":
        endDate = new Date();
        endDate.setMonth(startDate.getMonth() - 4); // 4달
        break;
      default:
        endDate = new Date();
    }

    getTotalCoinUseData(endDate, startDate);
  }, [toggleType]);

  useEffect(() => {
    console.log("toggleType", toggleType);
  }, [toggleType]);

  useEffect(() => {
    // getTotalCoinUseData();
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
      order: 1;
    }
    &:nth-child(2) {
      order: 2;
    }
    &:nth-child(3) {
      order: 3;
    }
    &:nth-child(4) {
      order: 4;
    }
    &:nth-child(5) {
      order: 5;
    }
    &:nth-child(6) {
      order: 6;
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
