import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ItemLogBlock from "@/Cabinet/components/Store/ItemUsageLog/ItemLogBlock";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ItemType } from "@/Cabinet/types/enum/store.enum";

interface IItemUsageLog {
  dateStr: any;
  date: Date;
  title: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const dummyData = {
  itemHistories: [
    {
      date: "2024-05-02T14:00:00",
      ItemDetailsDto: {
        sku: "extension_31",
        ItemName: "연장권",
        itemPrice: -2000,
        itemDetails: "3일",
      },
    },
    {
      date: "2024-04-05T10:00:00",
      ItemDetailsDto: {
        sku: "extension_31",
        ItemName: "페널티 축소권",
        itemPrice: -2000,
        itemDetails: "3일",
      },
    },
    {
      date: "2024-04-04T11:00:00",
      ItemDetailsDto: {
        sku: "extension_31",
        ItemName: "연장권",
        itemPrice: -2000,
        itemDetails: "3일",
      },
    },
    {
      date: "2024-04-03T13:00:00",
      ItemDetailsDto: {
        sku: "extension_31",
        ItemName: "연장권",
        itemPrice: -2000,
        itemDetails: "3일",
      },
    },
    {
      date: "2024-04-02T14:00:00",
      ItemDetailsDto: {
        sku: "extension_31",
        ItemName: "연장권",
        itemPrice: -2000,
        itemDetails: "3일",
      },
    },
  ],
  totalLength: 10,
};

function mapItemNameToType(itemName: string): ItemType {
  switch (itemName) {
    case "연장권":
      return ItemType.EXTENSION;
    case "이사권":
      return ItemType.SWAP;
    case "알림 등록권":
      return ItemType.ALERT;
    case "페널티 축소권":
      return ItemType.PENALTY;
    default:
      return ItemType.EXTENSION;
  }
}

const DateSection = ({ dateStr }: { dateStr: string }) => (
  <DateSectionStyled>
    <DateTitleStyled>{dateStr}</DateTitleStyled>
  </DateSectionStyled>
);

const ItemUsageLogPage = () => {
  const [itemUsageLogs, setItemUsageLogs] = useState<IItemUsageLog[]>([]);

  useEffect(() => {
    const formattedLogs = dummyData.itemHistories.map((item) => ({
      date: new Date(item.date),
      title: `${item.ItemDetailsDto.ItemName} - ${item.ItemDetailsDto.itemDetails}`,
      logo: ItemIconMap[mapItemNameToType(item.ItemDetailsDto.ItemName)],
      dateStr: `${new Date(item.date).getFullYear()}년 ${
        new Date(item.date).getMonth() + 1
      }월`,
    }));

    setItemUsageLogs(formattedLogs);
  }, []);

  return (
    <WrapperStyled>
      <TitleWrapperStyled>아이템 사용 내역</TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {itemUsageLogs.map((log, index, itemUsageLogsArr) => {
          const isNewMonth =
            index === 0 || log.dateStr !== itemUsageLogsArr[index - 1].dateStr;
          return (
            <LogItem key={index}>
              {isNewMonth && <DateSection dateStr={log.dateStr} />}
              <ItemLogBlock log={log} />
            </LogItem>
          );
        })}
      </ItemUsageLogWrapperStyled>
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
`;

const TitleWrapperStyled = styled.div`
  font-size: 32px;
  width: 80%;
  font-weight: 700;
  margin: 20px 0 16px;
  display: flex;
  justify-content: center;
`;

const ItemUsageLogWrapperStyled = styled.div`
  width: 80%;
`;

const LogItem = styled.div`
  margin-top: 20px;
`;

const DateSectionStyled = styled.div`
  margin-top: 30px;
`;

const DateTitleStyled = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export default ItemUsageLogPage;
