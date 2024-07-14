import { ResponsiveLine } from "@nivo/line";
import styled from "styled-components";
import { ICoinStatisticsDto } from "@/Cabinet/types/dto/admin.dto";
import { CoinUseDateType, CoinUseType } from "@/Cabinet/types/enum/store.enum";

const CoinUseLineChart = ({
  toggleType,
  coinToggleType,
  totalCoinUseData,
}: {
  toggleType: CoinUseDateType;
  coinToggleType: CoinUseType;
  totalCoinUseData: ICoinStatisticsDto | undefined;
}) => {
  if (totalCoinUseData === undefined) {
    return null;
  }

  console.log("totalCoinUseData", totalCoinUseData);

  const formattedData = [
    {
      id: "issuedCoin",
      data:
        totalCoinUseData?.issuedCoin?.map((item) => ({
          x: item.date,
          y: item.amount,
        })) || [],
    },
    {
      id: "usedCoin",
      data:
        totalCoinUseData?.usedCoin?.map((item) => ({
          x: item.date,
          y: item.amount,
        })) || [],
    },
  ];

  // NOTE : 발행코인, 미사용 코인, 사용코인 나눠서 보내주는 함수
  const filteredData = formattedData.filter(
    (data) => data.id === coinToggleType
  );

  const yMin = 0;
  const yMax = Math.max(...filteredData[0].data.map((d) => d.y));
  console.log("yMin, YMax", yMin, yMax);

  // NOTE : y축 scale을 log로 표현하기 위해 Y scale을 설정
  // ex) 123 이면 100 ~ 1000 사이의 값이니 10^0 ~ 10^3 사이의 값으로 표현
  const getYTickValues = (yMax: number) => {
    let remain = yMax;
    let exponent = 1;

    while (remain >= 10) {
      remain /= 10;
      exponent++;
    }
    const tickValues = [];
    for (let i = 0; i <= exponent; i++) {
      tickValues.push(Math.pow(10, i));
    }
    return tickValues;
  };
  const yTickValues = getYTickValues(yMax);

  return (
    <>
      <LineChartStyled>
        <ResponsiveLine
          theme={{
            textColor: "var(--normal-text-color)",
          }}
          tooltip={(point) => {
            return (
              <ToolTipStyled color={point.point.color}>
                <span></span>
                <p>
                  date : <strong>{point.point.data.xFormatted} </strong>
                </p>
                <p>
                  , coin : <strong>{point.point.data.yFormatted}</strong>
                </p>
              </ToolTipStyled>
            );
          }}
          isInteractive={true}
          animate={true}
          data={filteredData}
          margin={{ top: 80, right: 40, bottom: 50, left: 70 }}
          //  NOTE : %b -> 영어로 달 표시
          xFormat="time:%m.%d"
          xScale={{
            format: "%Y-%m-%d",
            precision: "day",
            type: "time",
            useUTC: false,
          }}
          // NOTE : symlog -> log scale에 0 값이 있을때 사용
          yScale={{
            type: "symlog",
            min: yMin,
            max: yMax,
          }}
          yFormat=" >0"
          curve="monotoneX"
          axisTop={null}
          colors={["var(--sys-main-color)"]}
          axisRight={null}
          // NOTE : x축은 날짜로 표현 -> xFormat가 time으로 되어 있어서  every 1 사용 가능
          axisBottom={{
            format: "%m.%d",
            tickPadding: 10, // tick padding
            tickValues: `every 1 ${toggleType.toLowerCase()}`,
          }}
          axisLeft={{
            tickValues: yTickValues,
          }}
          gridYValues={yTickValues}
          enableGridX={false}
          enableGridY={true}
          pointSize={0}
          enableArea={true}
          useMesh={true}
          enableSlices={false}
        />
      </LineChartStyled>
    </>
  );
};

const LineChartStyled = styled.div`
  height: 90%;
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

export default CoinUseLineChart;
