import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";
import { IMonthlyData } from "@/Cabinet/types/dto/admin.dto";

interface IChartInfo {
  x: string;
  y: number;
}

interface IChartData {
  id: string;
  data: IChartInfo[];
}

let init: IChartData[] = [
  {
    id: "대여",
    data: [],
  },
  {
    id: "반납",
    data: [],
  },
];

const convertData = (data: IMonthlyData[]) =>
  data.reduce(
    (acc, { startDate, endDate, lentStartCount, lentEndCount }, index) => {
      const end = new Date(startDate);
      const start = new Date(endDate);
      const dateInfo = `${start.getMonth() + 1}. ${start.getDate()} ~ ${
        end.getMonth() + 1
      }. ${end.getDate()}`;
      acc[0].data[index] = { x: dateInfo, y: lentStartCount };
      acc[1].data[index] = { x: dateInfo, y: lentEndCount };
      return acc;
    },
    init
  );

// 테마를 고치려면 ....
// 테마 프로퍼티 안에 속성들을 뜯어 봐야합니다 ... ㅠ
// theme 안에 legends나 axis프로퍼티 레퍼런스를 따라들어가서 nivo theme 객체를 열어봐야합니다.

// 색상 변경은 colors 프롭 안에 내용 수정

const LineChart = ({ data }: { data: IMonthlyData[] }) => (
  <LineChartStyled>
    <ResponsiveLine
      theme={{
        textColor: "var(--normal-text-color)",
        tooltip: {
          container: {
            backgroundColor: "var(--bg-color)",
            boxShadow: "var(--left-nav-border-shadow-color) 0 1px 2px",
            color: "var(--normal-text-color)",
          },
        },
      }}
      data={convertData(data)}
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      curve={"linear"}
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
      enableSlices={"x"}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 50,
          translateY: 50,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
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

export default LineChart;
