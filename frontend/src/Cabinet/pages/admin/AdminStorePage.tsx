import { useEffect, useState } from "react";
import styled from "styled-components";
import CoinUseLineChart from "@/Cabinet/components/AdminInfo/Chart/CoinUseLineChart";
import ItemBarChart from "@/Cabinet/components/AdminInfo/Chart/ItemBarChart";
import PieChartCoin from "@/Cabinet/components/AdminInfo/Chart/PieChartCoin";
import StoreHorizontalBarChart from "@/Cabinet/components/AdminInfo/Chart/StoreHorizontalBarChart";
import MultiToggleSwitch, {
  toggleItem,
} from "@/Cabinet/components/Common/MultiToggleSwitch";
import { MoveSectionButtonStyled } from "@/Cabinet/components/SectionPagination/SectionPagination";
import LeftSectionButton from "@/Cabinet/assets/images/LeftSectionButton.svg";
import {
  ICoinStatisticsDto,
  IItemUseCountDto,
} from "@/Cabinet/types/dto/admin.dto";
import { ICoinCollectInfoDto } from "@/Cabinet/types/dto/store.dto";
import { CoinUseDateType, CoinUseType } from "@/Cabinet/types/enum/store.enum";
import {
  axiosCoinCollectStatistics,
  axiosCoinUseStatistics,
  axiosStatisticsTotalItemUse,
} from "@/Cabinet/api/axios/axios.custom";
import { axiosStatisticsCoin } from "@/Cabinet/api/axios/axios.custom";
import { padToNDigits } from "@/Cabinet/utils/dateUtils";

const dataToggleList: toggleItem[] = [
  { name: "발행 코인", key: CoinUseType.ISSUE },
  { name: "사용 코인", key: CoinUseType.USED },
];

export interface ITotalCoinInfo {
  used: number;
  unused: number;
}

const AdminStorePage = () => {
  const [toggleType, setToggleType] = useState<CoinUseDateType>(
    CoinUseDateType.DAY
  );
  const [coinToggleType, setCoinToggleType] = useState<CoinUseType>(
    CoinUseType.ISSUE
  );
  const [coinCollectData, setCoinCollectData] = useState<ICoinCollectInfoDto[]>(
    []
  );
  const [coinCollectDate, setCoinCollectDate] = useState(new Date());
  const [totalCoinData, setTotalCoinData] = useState<
    { used: number; unused: number }[]
  >([]);
  const [totalCoinUseData, setTotalCoinUseData] = useState<
    ICoinStatisticsDto | undefined
  >();
  const [totalItemData, setTotalItemData] = useState<IItemUseCountDto[]>([]);

  const toggleList: toggleItem[] = [
    { name: "1d", key: CoinUseDateType.DAY },
    { name: "7d", key: CoinUseDateType.WEEK },
    { name: "30d", key: CoinUseDateType.MONTH },
  ];

  const getCoinCollectData = async () => {
    try {
      const response = await axiosCoinCollectStatistics(
        coinCollectDate.getFullYear(),
        coinCollectDate.getMonth() + 1
      );
      setCoinCollectData(response.data.coinCollectStatistics);
    } catch (error) {
      console.error("Error getting coin collect data:", error);
    }
  };

  const getTotalCoinData = async () => {
    try {
      const response = await axiosStatisticsCoin();
      const formattedData: { used: number; unused: number } = {
        used: response.data.used || 0,
        unused: response.data.unused || 0,
      };
      setTotalCoinData([formattedData]);
    } catch (error) {
      console.error("Error getting total coin data:", error);
      setTotalCoinData([{ used: 0, unused: 0 }]);
    }
  };

  const getTotalItemData = async () => {
    try {
      const response = await axiosStatisticsTotalItemUse();
      setTotalItemData(response.data.items);
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

  const moveMonth = (direction: string) => {
    let currentDateYear = coinCollectDate.getFullYear();
    let currentDateMonth = coinCollectDate.getMonth();

    if (direction === "left") {
      if (currentDateMonth === 1) {
        currentDateYear -= 1;
        currentDateMonth = 12;
      } else {
        currentDateMonth -= 1;
      }
    } else {
      if (currentDateMonth === 12) {
        currentDateYear += 1;
        currentDateMonth = 1;
      } else {
        currentDateMonth += 1;
      }
    }
    setCoinCollectDate(new Date(currentDateYear, currentDateMonth));
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
    getCoinCollectData();
  }, [coinCollectDate]);

  useEffect(() => {
    // getTotalCoinUseData();
    getTotalCoinData();
    getTotalItemData();
  }, []);

  return (
    <AdminStorePageStyled>
      <WrapperStyled>
        <HeaderStyled>
          <H2styled>재화 사용 통계</H2styled>
          <ToggleWrapperStyled>
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
          </ToggleWrapperStyled>
        </HeaderStyled>
        <CoinUseLineChart
          toggleType={toggleType}
          coinToggleType={coinToggleType}
          totalCoinUseData={totalCoinUseData}
        />
      </WrapperStyled>
      <WrapperStyled>
        <CoinCollectTitleWrapperStyled>
          <H2styled>동전 줍기 통계</H2styled>
          <div>
            <MoveSectionButtonStyled
              src={LeftSectionButton}
              onClick={() => moveMonth("left")}
              className="cabiButton"
            />
            <span>
              {coinCollectDate.getFullYear() +
                "년 " +
                padToNDigits(coinCollectDate.getMonth() + 1, 2) +
                "월"}
            </span>
            <MoveSectionButtonStyled
              src={LeftSectionButton}
              onClick={() => moveMonth("right")}
              arrowReversed={true}
              className="cabiButton"
            />
          </div>
        </CoinCollectTitleWrapperStyled>
        <StoreHorizontalBarChart data={coinCollectData} />
      </WrapperStyled>
      <WrapperStyled>
        <H2styled>전체 재화 현황</H2styled>
        <PieChartCoin data={totalCoinData} />
      </WrapperStyled>
      <WrapperStyled>
        <H2styled>아이템 사용 통계</H2styled>
        <ItemBarChart data={totalItemData} />
      </WrapperStyled>
    </AdminStorePageStyled>
  );
};

const HeaderStyled = styled.div`
  width: 90%;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  justify-content: start;
`;

const ToggleWrapperStyled = styled.div`
  width: 100%;
  padding-right: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-left: 60px;

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    & > :first-child {
      margin-bottom: 20px;
    }
  }
`;

const AdminStorePageStyled = styled.div`
  background: var(--bg-color);
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  place-items: center;
  min-height: 775px;
  padding: 42px 0;
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
    grid-template-rows: repeat(4, 500px);
    min-width: 300px;
    overflow: scroll;
    margin-bottom: 0;
    padding-bottom: 0;
    & > :first-child {
      grid-column: span 1;
    }
  }
`;

const WrapperStyled = styled.div`
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
  height: 70px;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  & > div > span {
    color: var(--ref-gray-400);
    height: 20px;
    line-height: 18px;
  }

  & > div > img {
    height: 20px;
    width: 20px;
  }
`;

export default AdminStorePage;
