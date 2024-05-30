import { BarSvgProps, ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";

export interface IitemUseCountDto {
  itemName: string;
  itemDetails: string;
  useCount: number;
}

interface ITransformedItem {
  item: string;
  [key: string]: number | string;
}

function transformData(itemCount: IitemUseCountDto[]): ITransformedItem[] {
  const transformedData: ITransformedItem[] = [];

  itemCount.forEach((item) => {
    const { itemName, itemDetails, useCount } = item;
    const existingItem = transformedData.find(
      (transformed) => transformed.item === itemName
    );

    if (existingItem) {
      const typeNumber = itemDetails.split("_")[1];
      existingItem[`type_${typeNumber}`] = useCount;
    } else {
      const newItem: ITransformedItem = {
        item: itemName,
      };

      const typeNumber = itemDetails.split("_")[1];
      newItem[`type_${typeNumber}`] = useCount;

      transformedData.push(newItem);
    }
  });
  return transformedData;
}

const ItemBarChart = ({ data }: { data: IitemUseCountDto[] }) => (
  <ItemBarChartStyled>
    <ResponsiveBar
      theme={{
        legends: { text: { fontSize: "14px" } },
        axis: { ticks: { text: { fontSize: "14px" } } },
        labels: { text: { fontSize: "14px" } },
        textColor: "var(--normal-text-color)",
        tooltip: {
          container: {
            backgroundColor: "var(--bg-color)",
            boxShadow: "var(--left-nav-border-shadow-color) 0 1px 2px",
            color: "var(--normal-text-color)",
          },
        },
      }}
      data={transformData(data)}
      keys={["type_undefined", "type_31", "type_15", "type_7", "type_3"]}
      indexBy="item" 
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.2}
      layout="vertical"
      groupMode="stacked"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[
        "var(--sys-main-color)",
        "var(--sys-main-color)",
        "var(--ref-purple-400)",
        "var(--ref-purple-400)",
        "var(--ref-purple-200)",
      ]}
      defs={[]}
      fill={[]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
      enableLabel={true}
      labelSkipWidth={17}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[]}
      role="application"
      ariaLabel="Admin  Item Bar Chart"
      barAriaLabel={(e) =>
        e.id + ": " + e.formattedValue + " in item: " + e.indexValue
      }
    />
  </ItemBarChartStyled>
);

const ItemBarChartStyled = styled.div`
  height: 90%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ItemBarChart;
