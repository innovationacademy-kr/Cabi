import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";
import { ICoinCollectInfo } from "@/Cabinet/pages/admin/AdminStorePage";

const convert = (data: ICoinCollectInfo[]) => {
  let userTotalPerCnt = 0;
  let total = 0;
  let ary = [];

  data.forEach((cur) => {
    userTotalPerCnt += cur.userCount;

    // 0~5회, 6~10회, 11~15회, 16~20회
    if (
      cur.coinCount % 5 === 0 &&
      cur.coinCount / 5 >= 1 &&
      cur.coinCount / 5 <= 4
    ) {
      ary.push({
        cnt: cur.coinCount + "회",
        [cur.coinCount + "회"]: userTotalPerCnt,
      });
      total += userTotalPerCnt;
      userTotalPerCnt = 0;
    }
  });
  ary.push({ cnt: "전체", ["전체"]: total });

  return ary;
};

const StoreHorizontalBarChart = ({ data }: { data: ICoinCollectInfo[] }) => {
  return (
    <HalfPieChartStyled>
      <ResponsiveBar
        data={convert(data)}
        keys={["5회", "10회", "15회", "20회", "전체"]}
        indexBy="cnt"
        maxValue="auto"
        borderWidth={2}
        borderColor={{ from: "color" }}
        layout="horizontal"
        animate={true}
        isInteractive={true}
        enableGridX={false}
        enableGridY={false}
        axisLeft={{ tickSize: 0, tickPadding: 25 }}
        tooltip={(point) => {
          return (
            <ToolTipStyled color={point.color}>
              <span></span>
              {point.data.cnt + " - "}
              <strong>{point.value}</strong>명
            </ToolTipStyled>
          );
        }}
        theme={{
          legends: { text: { fontSize: "14px" } },
          labels: { text: { fontSize: "14px", fill: "var(--ref-gray-500)" } },
          axis: { ticks: { text: { fontSize: "14px" } } },
          textColor: "var(--normal-text-color)",
        }}
        margin={{ top: 20, right: 70, bottom: 80, left: 80 }}
        colors={[
          "var(--ref-purple-200)",
          "var(--ref-purple-300)",
          "var(--sys-main-color)",
          "var(--ref-purple-650)",
          "var(--ref-purple-690)",
          "var(--ref-purple-200)",
        ]}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom",
            direction: "row",
            itemWidth: 56,
            itemHeight: 0,
            itemTextColor: "var(--gray-line-btn-color)",
            translateX: 0,
            translateY: 44,
            itemsSpacing: 2,
            itemDirection: "top-to-bottom",
            symbolSize: 12,
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
    </HalfPieChartStyled>
  );
};

const HalfPieChartStyled = styled.div`
  height: 80%;
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

export default StoreHorizontalBarChart;
