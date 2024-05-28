// import { ResponsiveLine } from "@nivo/line";
import { LineSvgProps, ResponsiveLine } from "@nivo/line";
import { useState } from "react";
import styled from "styled-components";
import MultiToggleSwitch, { toggleItem } from "../../Common/MultiToggleSwitch";
import ToggleSwitch from "../../Common/ToggleSwitch";

interface CoinAmountDto {
  date: Date;
  amount: number;
}

export enum CoinDateType {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

const toggleList: toggleItem[] = [
  { name: "1d", key: CoinDateType.DAY },
  { name: "7d", key: CoinDateType.WEEK },
  { name: "30d", key: CoinDateType.MONTH },
];

function generateDummyData(
  startDate: string,
  endDate: string
): {
  issueCoin: CoinAmountDto[];
  unusedCoin: CoinAmountDto[];
  usedCoin: CoinAmountDto[];
} {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const oneDay = 24 * 60 * 60 * 1000; // 하루의 밀리초

  const dummyData = {
    issueCoin: [] as CoinAmountDto[],
    unusedCoin: [] as CoinAmountDto[],
    usedCoin: [] as CoinAmountDto[],
  };

  for (
    let date = start;
    date <= end;
    date = new Date(date.getTime() + oneDay)
  ) {
    // 예시 데이터 생성 로직
    dummyData.issueCoin.push({
      date: new Date(date),
      amount: Math.floor(Math.random() * 2000) + 1000,
    });
    dummyData.unusedCoin.push({
      date: new Date(date),
      amount: Math.floor(Math.random() * 500) + 500,
    });
    dummyData.usedCoin.push({
      date: new Date(date),
      amount: Math.floor(Math.random() * 700) + 300,
    });
  }

  return dummyData;
}

const CoinFlow = () => {
  const [toggleType, setToggleType] = useState<CoinDateType>(CoinDateType.DAY);
  const calculateEndDate = (startDate: Date, type: CoinDateType) => {
    switch (type) {
      case CoinDateType.DAY:
        return new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 뒤
      case CoinDateType.WEEK:
        return new Date(startDate.getTime() + 4 * 7 * 24 * 60 * 60 * 1000); // 4주 뒤
      case CoinDateType.MONTH:
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 4); // 4개월 뒤
        return endDate;
      default:
        return startDate;
    }
  };

  // 현재 날짜
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 현재 날짜의 시간을 00:00:00으로 설정

  // 종료 날짜 계산
  const endDate = calculateEndDate(today, toggleType);

  // 데이터 생성 함수 호출
  const dummyData = generateDummyData(
    today.toISOString().split("T")[0], // 형식 YYYY-MM-DD
    endDate.toISOString().split("T")[0] // 형식 YYYY-MM-DD
  );
  const formattedData = [
    {
      id: "issueCoin",
      data: dummyData.issueCoin.map((item) => ({
        x: item.date.toISOString().split("T")[0],
        y: item.amount,
      })),
    },
    {
      id: "unusedCoin",
      data: dummyData.unusedCoin.map((item) => ({
        x: item.date.toISOString().split("T")[0],
        y: item.amount,
      })),
    },
    {
      id: "usedCoin",
      data: dummyData.usedCoin.map((item) => ({
        x: item.date.toISOString().split("T")[0],
        y: item.amount,
      })),
    },
  ];
  return (
    <>
      <MultiToggleSwitch
        initialState={toggleType}
        setState={setToggleType}
        toggleList={toggleList}
      />
      <LineChartStyled>
        <ResponsiveLine
          theme={{
            textColor: "var(--normal-text-color)",
            tooltip: {
              container: {
                backgroundColor: "var(--bg-color)",
                boxShadow: "var(--left-nav-border-shadow-color) 0 1px 2px",
                color: "var(--normal-text-color)",
              },
            },
          }}
          data={formattedData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xFormat="time:%Y-%m-%d"
          xScale={{
            format: "%Y-%m-%d",
            precision: "day",
            type: "time",
            useUTC: false,
          }}
          yScale={{
            type: "linear",
            min: 0,
            max: "auto",
          }}
          yFormat=" >0"
          curve="cardinal"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            format: "%b %d",
            legendOffset: -12,
            tickValues: `every 1 ${toggleType.toLowerCase()}`,
          }}
          axisLeft={{
            legendOffset: 12,
          }}
          enableGridX={false}
          pointSize={0}
          pointColor={{ from: "color", modifiers: [] }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          enableArea={true}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 110,
              translateY: 0,
              itemWidth: 100,
              itemHeight: 20,
              itemsSpacing: 2,
              symbolSize: 10,
              symbolShape: "circle",
              itemDirection: "left-to-right",
              itemTextColor: "#777",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </LineChartStyled>
    </>
  );
};

const LineChartStyled = styled.div`
  height: 90%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CoinFlow;
