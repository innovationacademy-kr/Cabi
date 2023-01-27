import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";

const resData = [
  { floor: 2, total: 148, used: 114, overdue: 0, unused: 26, disabled: 8 },
  { floor: 4, total: 100, used: 73, overdue: 1, unused: 21, disabled: 5 },
  { floor: 5, total: 96, used: 62, overdue: 0, unused: 27, disabled: 7 },
];

const result = resData.map((data) => ({
  floor: data.floor + "층",
  ["사용 중"]: data.used,
  ["미사용"]: data.unused,
  ["연체 중"]: data.overdue,
  ["고장"]: data.disabled,
}));

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const BarChart = () => (
  <BarChartStyled>
    <ResponsiveBar
      data={result}
      keys={["고장", "연체 중", "사용 중", "미사용"]}
      indexBy="floor"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#595959", "#ff4e4e", "#e2e4e3", "#9747ff"]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "transparent",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "미사용",
          },
          id: "lines",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  </BarChartStyled>
);

const BarChartStyled = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BarChart;
