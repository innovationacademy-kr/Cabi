import { ResponsivePie } from "@nivo/pie";
import styled from "styled-components";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface IRentInfo {
  floor: number;
  total: number;
  used: number;
  overdue: number;
  unused: number;
  disabled: number;
}

const convert = (data: IRentInfo[]) =>
  data.map(({ floor, total }: { floor: number; total: number }) => ({
    id: floor + "층",
    label: floor + "층",
    value: total,
  }));

const PieChart = ({ data }: { data: IRentInfo[] }) => (
  <PieChartContainerStyled>
    <PieChartStyled>
      <ResponsivePie
        data={convert(data)}
        theme={{
          legends: { text: { fontSize: "1.5rem" } },
          labels: { text: { fontSize: "1.5rem" } },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        colors={["skyblue", "pink", "lime"]}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "2층",
            },
            id: "2층",
          },
          {
            match: {
              id: "4층",
            },
            id: "4층",
          },
          {
            match: {
              id: "5층",
            },
            id: "5층",
          },
        ]}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </PieChartStyled>
  </PieChartContainerStyled>
);

const PieChartContainerStyled = styled.div`
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const PieChartStyled = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default PieChart;
