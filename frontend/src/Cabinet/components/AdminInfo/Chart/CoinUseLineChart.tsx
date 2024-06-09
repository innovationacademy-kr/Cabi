// import { ResponsiveLine } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";
import { ICoinStatisticsDto } from "@/Cabinet/pages/admin/AdminStorePage";
import { CoinUseDateType, CoinUseType } from "@/Cabinet/types/enum/store.enum";

const CoinUseLineChart = ({
  toggleType,
  coinToggleType,
  totalCoinUseData,
}: {
  toggleType: CoinUseDateType;
  coinToggleType: CoinUseType;
  totalCoinUseData: ICoinStatisticsDto | undefined;
}) => {
  if (totalCoinUseData === undefined) {
    return null;
  }
  const formattedData = [
    {
      id: "issuedCoin",
      data:
        totalCoinUseData?.issuedCoin?.map((item) => ({
          x: item.date,
          y: item.amount,
        })) || [],
    },
    {
      id: "usedCoin",
      data:
        totalCoinUseData?.usedCoin?.map((item) => ({
          x: item.date,
          y: item.amount,
        })) || [],
    },
  ];

  // 발행코인, 미사용 코인, 사용코인 나눠서 보내주는 함수
  const filteredData = formattedData.filter(
    (data) => data.id === coinToggleType
  );

  return (
    <>
      <LineChartStyled>
        <ResponsiveLine
          theme={{
            textColor: "var(--normal-text-color)",
          }}
          tooltip={(point) => {
            return (
              <ToolTipStyled color={point.point.color}>
                <span></span>
                <p>
                  date : <strong>{point.point.data.xFormatted} </strong>
                </p>
                <p>
                  , coin : <strong>{point.point.data.yFormatted}</strong>
                </p>
              </ToolTipStyled>
            );
          }}
          isInteractive={true}
          animate={true}
          data={filteredData}
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
          // xFormat="time:%b %d"
          // %b -> 영어로 달 표시
          xFormat="time:%m.%d"
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
          // curve="cardinal"
          curve="monotoneX"
          axisTop={null}
          colors={["var(--sys-main-color)"]}
          axisRight={null}
          axisBottom={{
            format: "%m.%d",
            legendOffset: -12,
            tickValues: `every 1 ${toggleType.toLowerCase()}`,
          }}
          axisLeft={{
            legendOffset: 12,
          }}
          enableGridX={false}
          pointSize={0}
          enableArea={true}
          useMesh={true}
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

const ToolTipStyled = styled.div<{ color: string }>`
  height: 24px;
  background-color: var(--bg-color);
  box-shadow: var(--left-nav-border-shadow-color) 0 1px 2px;
  color: var(--normal-text-color);
  display: flex;
  align-items: center;
  padding: 5px 9px;
  border-radius: 2px;

  & > span {
    display: block;
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.color};
    margin-right: 8px;
  }
`;

export default CoinUseLineChart;
