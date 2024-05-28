import { ResponsivePie } from "@nivo/pie";
import styled from "styled-components";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface ICoinInfo {
  used: number;
  unused: number;
}

type CoinStatus = {
  [used: string]: number;
  unused: number;
};

type TextMap = {
  [used: string]: string;
  unused: string;
};

const convert = (data: ICoinInfo[]) => {
  const textMap: TextMap = {
    used: "사용",
    unused: "보유",
  };
  const obj: CoinStatus = data.reduce(
    (acc, cur) => {
      acc.used += cur.used;
      acc.unused += cur.unused;
      return acc;
    },
    { used: 0, unused: 0 } as CoinStatus
  );
  return Object.keys(obj).map((key: string) => ({
    id: textMap[key],
    value: obj[key],
  }));
};

const PieChart = ({ data }: { data: ICoinInfo[] }) => {
  return (
    <PieChartStyled>
      <ResponsivePie
        data={convert(data)}
        theme={{
          legends: { text: { fontSize: "15px" } },
          labels: { text: { fontSize: "15px" } },
          tooltip: {
            container: {
              backgroundColor: "var(--bg-color)",
              boxShadow: "var(--left-nav-border-shadow-color) 0 1px 2px",
              color: "var(--normal-text-color)",
            },
          },
        }}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        colors={["var(--full-color)", "var(--sys-main-color)"]}
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
        arcLinkLabelsTextColor="var(--pie-chart-label-text-color)"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 5,
            itemWidth: 70,
            itemHeight: 18,
            itemTextColor: "var(--gray-line-btn-color)",
            itemDirection: "top-to-bottom",
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "var(--normal-text-color)",
                },
              },
            ],
          },
        ]}
      />
    </PieChartStyled>
  );
};

const PieChartStyled = styled.div`
  height: 90%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default PieChart;
