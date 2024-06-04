import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";
import { ICoinCollectInfo } from "@/Cabinet/pages/admin/AdminStorePage";

const convert = (data: ICoinCollectInfo[]) => {
  let userTotalPerCnt = 0;
  let total = 0;
  let ary: any = [];
  data.forEach((cur) => {
    userTotalPerCnt += cur.userCount;
    if (
      cur.coinCount % 5 === 0 &&
      cur.coinCount / 5 >= 1 &&
      cur.coinCount / 5 <= 4
    ) {
      total += userTotalPerCnt;
      ary.push({ cnt: cur.coinCount + "회", "유저 수": userTotalPerCnt });
      userTotalPerCnt = 0;
    }
  });
  ary.push({ cnt: "전체", "유저 수": total });

  return ary;
};

const StoreHalfPieChart = ({ data }: { data: ICoinCollectInfo[] }) => {
  return (
    <HalfPieChartStyled>
      <ResponsiveBar
        data={convert(data)}
        keys={["유저 수"]}
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
        // legends={[
        //   {
        //     // anchor: "bottom",
        //     // direction: "row",
        //     // justify: false,
        //     // translateX: 0,
        //     // translateY: 30,
        //     // itemsSpacing: 5,
        //     // itemWidth: 50,
        //     // itemHeight: 18,
        //     // itemTextColor: "var(--gray-line-btn-color)",
        //     // itemDirection: "top-to-bottom",
        //     // itemOpacity: 1,
        //     // symbolSize: 12,
        //     // symbolShape: "circle",
        //     // effects: [
        //     //   {
        //     //     on: "hover",
        //     //     style: {
        //     //       itemTextColor: "var(--normal-text-color)",
        //     //     },
        //     //   },
        //     // ],
        //   },
        // ]}
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
