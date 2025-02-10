import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";
import { ICoinCollectInfoDto } from "@/Cabinet/types/dto/store.dto";

const keys = ["1~5회", "6~10회", "11~15회", "16~20회", "전체"];

interface IConvertedData {
  cnt: string;
  [key: string]: number | string;
}

const convert = (data: ICoinCollectInfoDto[]) => {
  let userTotalPerCnt = 0;
  let userTotal = 0;
  let ary: IConvertedData[] = [];

  data.forEach((cur) => {
    userTotalPerCnt += cur.userCount;

    // NOTE : 정책에 따라 변경
    // 현재 정책 - 0~5, 6~10, 11~15, 16~20회
    if (
      cur.coinCount % 5 === 0 &&
      cur.coinCount / 5 >= 1 &&
      cur.coinCount / 5 <= 4
    ) {
      ary = [
        ...ary,
        {
          cnt: cur.coinCount - 4 + "~" + cur.coinCount + "회",
          [cur.coinCount - 4 + "~" + cur.coinCount + "회"]: userTotalPerCnt,
        },
      ];
      userTotal += userTotalPerCnt;
      userTotalPerCnt = 0;
    }
  });

  return [...ary, { cnt: "전체", ["전체"]: userTotal }];
};

const StoreHorizontalBarChart = ({ data }: { data: ICoinCollectInfoDto[] }) => {
  return (
    <HalfPieChartStyled>
      <ResponsiveBar
        data={convert(data)}
        keys={keys}
        indexBy="cnt"
        maxValue="auto"
        borderWidth={2}
        borderColor={{ from: "color" }}
        layout="horizontal"
        animate={true}
        isInteractive={true}
        enableGridX={true}
        enableGridY={false}
        tooltip={(point) => {
          return (
            <ToolTipStyled color={point.color}>
              <span></span>
              {point.data.cnt + ":"} <strong>{point.value}</strong>명
            </ToolTipStyled>
          );
        }}
        theme={{
          legends: { text: { fontSize: "12px" } },
          labels: { text: { fontSize: "14px", fill: "var(--ref-gray-500)" } },
          axis: { ticks: { text: { fontSize: "12px" } } },
          textColor: "var(--normal-text-color)",
        }}
        margin={{ top: 20, right: 56, bottom: 80, left: 70 }}
        colors={[
          "var(--ref-purple-200)",
          "var(--ref-purple-400)",
          "var(--sys-main-color)",
          "var(--ref-purple-700)",
          "var(--ref-purple-800)",
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
        labelSkipWidth={1}
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

  @media screen and (max-width: 1100px) {
    width: 100%;
  }
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
  & > strong {
    padding-left: 4px;
  }
`;

export default StoreHorizontalBarChart;
