import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";

export interface IItemUseCountDto {
  itemName: string;
  itemDetails: string;
  userCount: number;
}

interface ITransformedItem {
  item: string;
  [key: string]: number | string;
}


/*
    if (existingItem) {
      existingItem[`${itemName}-${itemDetails}`] = userCount;
    } else {
      const newItem: ITransformedItem = {
        item: itemName,
      };

      if (itemName === itemDetails) {
        newItem[itemDetails] = userCount;
      } else {
        newItem[`${itemName}-${itemDetails}`] = userCount;
      }

      transformedData.push(newItem);
    }
  });
*/
const transformData = (itemArr: IItemUseCountDto[]): ITransformedItem[] => {
  const transformedData: ITransformedItem[] = [];

  itemArr.forEach((item) => {
    const { itemName, itemDetails, userCount } = item;
    const existingItem = transformedData.find(
      (transformed) => transformed.item === itemName
    );

    if (existingItem) {
      existingItem[`${itemName}-${itemDetails}`] = userCount;
    } else {
      const newItem: ITransformedItem = {
        item: itemName,
      };

      if (itemName === itemDetails) {
        newItem[itemDetails] = userCount;
      } else {
        newItem[`${itemName}-${itemDetails}`] = userCount;
      }

      transformedData.push(newItem);
    }
  });
  console.log(transformedData);
  return transformedData;
};
// const transformData = (itemArr: IItemUseCountDto[]): ITransformedItem[] => {
//   const transformedData: ITransformedItem[] = [];

//   itemArr.forEach((item) => {
//     const { itemName, itemDetails, userCount } = item;
//     const existingItem = transformedData.find(
//       (transformed) => transformed.item === itemName
//     );

//     if (existingItem) {
//       existingItem[`${itemName}-${itemDetails}`] = userCount;
//     } else {
//       const newItem: ITransformedItem = {
//         item: itemName,
//         [itemDetails]: userCount,
//       };
//       transformedData.push(newItem);
//     }
//   });
//   return transformedData;
// };

const ItemBarChart = ({ data }: { data: IItemUseCountDto[] }) => (
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
      keys={["이사권", "알림 등록권", "연장권-31일", "연장권-15일", "연장권-3일","페널티 감면권-31일","페널티 감면권-7일", "페널티 감면권-3일"]}
      indexBy="item"
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.2}
      layout="vertical"
      groupMode="stacked"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[
        "var(--custom-green-200)",
        "var(--custom-yellow)",
        "var(--custom-blue-300)",
        "var(--custom-blue-200)",
        "var(--custom-blue-100)",
        "var(--custom-pink-300)",
        "var(--custom-pink-200)",
        "var(--custom-pink-100)",
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
