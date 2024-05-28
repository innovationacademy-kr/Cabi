import { ResponsiveBar } from "@nivo/bar";
import styled from "styled-components";

const ItemBarChart = () => (
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
      data={[
        {
          item: "연장권",
          "type_1": 10,
          "type_2": 12,
          "type_3": 15,
        },
        {
          item: "이사권",
          value: 28,
        },
        {
          item: "알림권",
          value: 18,
        },
        {
          item: "패널티 축소권",
          "3일": 4,
          "type_2": 3,
          "type_3": 4,
        },
      ]}
      keys={["type_1", "type_2", "type_3", "value"]}
      indexBy="item" // 수정: "item" 대신 "item"로 변경
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      padding={0.3}
      layout="vertical"
      groupMode="stacked"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[
        "var(--ref-purple-200)",
        "var(--ref-purple-400)",
        "var(--sys-main-color)",
        "var(--sys-main-color)",
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
      axisLeft={null}
      enableLabel={false}
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
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ItemBarChart;
