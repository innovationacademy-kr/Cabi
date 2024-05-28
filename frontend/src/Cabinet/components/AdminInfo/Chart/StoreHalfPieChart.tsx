import { ResponsivePie } from "@nivo/pie";
import styled from "styled-components";
import { ICoinCollectInfo } from "@/Cabinet/pages/admin/AdminStorePage";

const convert = (data: ICoinCollectInfo[]) => {
  let total = 0;
  const obj = data.map((cur) => {
    total += cur.userCount;
    return { id: cur.coinCount + "회", value: cur.userCount };
  });

  obj.push({ id: "전체", value: total });
  return obj;
};

const StoreHalfPieChart = ({ data }: { data: ICoinCollectInfo[] }) => {
  return (
    <HalfPieChartStyled>
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
        colors={[
          "var(--ref-purple-200)",
          "var(--ref-purple-300)",
          "var(--sys-main-color)",
          "var(--ref-purple-650)",
          "var(--ref-purple-690)",
        ]}
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
        arcLabelsTextColor={"var(--white-text-with-bg-color)"}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 30,
            itemsSpacing: 5,
            itemWidth: 50,
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
        startAngle={-90}
        endAngle={90}
      />
    </HalfPieChartStyled>
  );
};

const HalfPieChartStyled = styled.div`
  height: 90%;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default StoreHalfPieChart;
