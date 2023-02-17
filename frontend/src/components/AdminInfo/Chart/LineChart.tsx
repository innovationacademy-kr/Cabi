import { ResponsiveLine } from "@nivo/line";
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

const dummyData = [
  {
    id: "대여",
    color: "purple",
    data: [
      {
        x: "1월 4주차",
        y: 130,
      },
      {
        x: "2월 1주차",
        y: 94,
      },
      {
        x: "2월 2주차",
        y: 150,
      },
      {
        x: "2월 3주차",
        y: 220,
      },
    ],
  },
  {
    id: "반납",
    color: "red",
    data: [
      {
        x: "1월 4주차",
        y: 15,
      },
      {
        x: "2월 1주차",
        y: 20,
      },
      {
        x: "2월 2주차",
        y: 0,
      },
      {
        x: "2월 3주차",
        y: 100,
      },
    ],
  },
];

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

const LineChart = ({ data }: { data: IRentInfo[] }) => (
  <LineChartStyled>
    <ResponsiveLine
      data={dummyData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      curve={"natural"}
      colors={["purple", "red"]}
      yFormat=" >0"
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
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
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LineChart;
