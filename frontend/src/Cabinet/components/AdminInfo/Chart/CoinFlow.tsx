// import { ResponsiveLine } from "@nivo/line";
import { LineSvgProps, ResponsiveLine } from "@nivo/line";
import styled from "styled-components";

interface CoinAmountDto {
  date: Date;
  amount: number;
}
const dummyData = {
  issueCoin: [
    { date: new Date(2024, 4, 1), amount: 1000 },
    { date: new Date(2024, 4, 2), amount: 1500 },
    { date: new Date(2024, 4, 3), amount: 2000 },
    { date: new Date(2024, 4, 4), amount: 2500 },
    { date: new Date(2024, 4, 5), amount: 3000 },
  ] as CoinAmountDto[],
  unusedCoin: [
    { date: new Date(2024, 4, 1), amount: 500 },
    { date: new Date(2024, 4, 2), amount: 700 },
    { date: new Date(2024, 4, 3), amount: 800 },
    { date: new Date(2024, 4, 4), amount: 600 },
    { date: new Date(2024, 4, 5), amount: 900 },
  ] as CoinAmountDto[],
  usedCoin: [
    { date: new Date(2024, 4, 1), amount: 300 },
    { date: new Date(2024, 4, 2), amount: 400 },
    { date: new Date(2024, 4, 3), amount: 500 },
    { date: new Date(2024, 4, 4), amount: 700 },
    { date: new Date(2024, 4, 5), amount: 1000 },
  ] as CoinAmountDto[],
};

const CoinFlow = () => (
  <LineChartStyled>
    <ResponsiveLine
      data={dummyData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="cardinal"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "transportation",
        legendOffset: 36,
        legendPosition: "middle",
        // truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "count",
        legendOffset: -40,
        legendPosition: "middle",
        // truncateTickAt: 0,
      }}
      enableGridX={false}
      pointSize={10}
      pointColor={{ from: "color", modifiers: [] }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableArea={true}
      //   enableTouchCrosshair={true}
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
);

const LineChartStyled = styled.div`
  height: 90%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default CoinFlow;
