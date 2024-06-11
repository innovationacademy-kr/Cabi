import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { IItemUseCountDto } from "@/Cabinet/types/dto/admin.dto";

interface ITransformedItem {
  item: string;
  [key: string]: number | string;
}

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

  return transformedData;
};

const ItemBarChart = ({ data }: { data: IItemUseCountDto[] }) => {
  const itemData: ITransformedItem[] = transformData(data);
  return (
    <ItemBarChartStyled>
      <ResponsiveBarStyled>
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
          keys={[
            "이사권",
            "알림 등록권",
            "연장권-31일",
            "연장권-15일",
            "연장권-3일",
            "페널티 감면권-31일",
            "페널티 감면권-7일",
            "페널티 감면권-3일",
          ]}
          indexBy="item"
          margin={{ top: 60, right: 30, bottom: 50, left: 35 }}
          padding={0.3}
          layout="vertical"
          groupMode="stacked"
          valueScale={{ type: "linear" }} //symlog
          indexScale={{ type: "band", round: true }}
          colors={[
            "var(--sys-main-color)",
            "var(--sys-main-color)",
            "var(--sys-main-color)",
            "var(--ref-purple-300)",
            "var(--ref-purple-200)",
            "var(--sys-main-color)",
            "var(--ref-purple-300)",
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
            // tickRotation: -45, //아이템 이름 각도
            tickRotation: 0, //아이템 이름 각도
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
          minValue={0}
        />
      </ResponsiveBarStyled>

      <ItemLegendsStyled></ItemLegendsStyled>
    </ItemBarChartStyled>
  );
};

const ItemBarChartStyled = styled.div`
  height: 90%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (min-width: 768px) {
    padding-right: 60px;
    padding-left: 60px;
  }
`;

const ResponsiveBarStyled = styled.div`
  height: 100%;
  width: 100%;
`;

const ItemLegendsStyled = styled.div`
  height: 100%;
  width: 0%;
  background-color: #d5d5ff;
`;

export default ItemBarChart;

// const itemList: IItemUseCountDto[] = [
//   { itemName: "연장권", itemDetails: "출석 연장권 보상", userCount: 0 },
//   { itemName: "연장권", itemDetails: "31일", userCount: 530 },
//   { itemName: "연장권", itemDetails: "15일", userCount: 22 },
//   { itemName: "연장권", itemDetails: "3일", userCount: 3},
//   { itemName: "페널티 감면권", itemDetails: "31일", userCount: 1 },
//   { itemName: "페널티 감면권", itemDetails: "7일", userCount: 30 },
//   { itemName: "페널티 감면권", itemDetails: "3일", userCount: 10 },
//   { itemName: "이사권", itemDetails: "이사권", userCount: 60 },
//   { itemName: "알림 등록권", itemDetails: "알림 등록권", userCount: 100 },
// ];
