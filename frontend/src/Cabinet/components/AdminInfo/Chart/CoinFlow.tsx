// import { ResponsiveLine } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";
import { ICoinStatisticsDto } from "@/Cabinet/pages/admin/AdminStorePage";
import { CoinDateType, CoinFlowType } from "@/Cabinet/types/enum/store.enum";

const CoinFlow = ({
  toggleType,
  coinToggleType,
  totalCoinUseData,
}: {
  toggleType: CoinDateType;
  coinToggleType: CoinFlowType;
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
            tooltip: {
              container: {
                backgroundColor: "var(--bg-color)",
                boxShadow: "var(--left-nav-border-shadow-color) 0 1px 2px",
                color: "var(--normal-text-color)",
              },
            },
          }}
          data={filteredData}
          margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
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
          // curve="cardinal"
          curve="monotoneX"
          axisTop={null}
          colors={["var(--sys-main-color)"]}
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
