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
  ["사용가능"]: data.unused,
  ["반납지연"]: data.overdue,
  ["사용불가"]: data.disabled,
}));

interface IRentInfo {
  floor: number;
  total: number;
  used: number;
  overdue: number;
  unused: number;
  disabled: number;
}

const convert = (data: IRentInfo[]) =>
  data.map(
    ({
      floor,
      used,
      unused,
      overdue,
      disabled,
    }: {
      floor: number;
      used: number;
      unused: number;
      overdue: number;
      disabled: number;
    }) => ({
      floor: floor + "층",
      ["사용 중"]: used,
      ["사용가능"]: unused,
      ["반납지연"]: overdue,
      ["사용불가"]: disabled,
    })
  );

// 테마를 고치려면 ....
// 테마 프로퍼티 안에 속성들을 뜯어 봐야합니다 ... ㅠ
// theme 안에 legends나 axis프로퍼티 레퍼런스를 따라들어가서 nivo theme 객체를 열어봐야합니다.

// 색상 변경은 colors 프롭 안에 내용 수정

const BarChart = ({ data }: { data: IRentInfo[] }) => (
  <BarChartStyled>
    <ResponsiveBar
      theme={{
        legends: { text: { fontSize: "1.2rem" } },
        axis: { ticks: { text: { fontSize: "1.25rem" } } },
        labels: { text: { fontSize: "1.2rem" } },
      }}
      data={convert(data)}
      keys={["사용불가", "반납지연", "사용 중", "사용가능"]}
      indexBy="floor"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["#595959", "#ff4e4e", "#e2e4e3", "#9747ff"]}
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
          itemsSpacing: 20,
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
      ariaLabel="Admin Bar Chart"
      barAriaLabel={function (e) {
        return "Admin Bar Chart";
      }}
    />
  </BarChartStyled>
);

const BarChartStyled = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BarChart;
