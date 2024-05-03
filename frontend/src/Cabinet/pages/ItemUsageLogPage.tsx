import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ItemLogBlock from "@/Cabinet/components/Store/ItemUsageLog/ItemLogBlock";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosGetItemUsageHistory } from "@/Cabinet/api/axios/axios.custom";

interface IItemUsageLog {
  dateStr: string;
  date: Date;
  title: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

function mapItemNameToType(itemName: string): StoreItemType {
  switch (itemName) {
    case "연장권":
      return StoreItemType.EXTENSION;
    case "이사권":
      return StoreItemType.SWAP;
    case "알림 등록권":
      return StoreItemType.ALERT;
    case "패널티 감면권":
      return StoreItemType.PENALTY;
    default:
      return StoreItemType.EXTENSION;
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
    getItemUsageLog(0, 10);
  }, []);

  const getItemUsageLog = async (page: number, size: number) => {
    try {
      const data = await axiosGetItemUsageHistory(page, size);
      const formattedLogs = data.result.map(
        (item: {
          date: string | number | Date;
          itemDto: { itemName: string; itemDetails: any };
        }) => ({
          date: new Date(item.date),
          title:
            item.itemDto.itemName === item.itemDto.itemDetails
              ? item.itemDto.itemName
              : `${item.itemDto.itemName} - ${item.itemDto.itemDetails}`,
          logo: ItemIconMap[mapItemNameToType(item.itemDto.itemName)],
          dateStr: `${new Date(item.date).getFullYear()}년 ${
            new Date(item.date).getMonth() + 1
          }월`,
        })
      );
      setItemUsageLogs(formattedLogs);
    } catch (error) {
      console.error("Failed to fetch item usage history:", error);
    }
  };

  return (
    <WrapperStyled>
      <TitleWrapperStyled>아이템 사용 내역</TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {itemUsageLogs.map((log, index, itemUsageLogsArr) => {
          const isNewMonth =
            index === 0 || log.dateStr !== itemUsageLogsArr[index - 1].dateStr;
          return (
            <LogItemStyled key={index}>
              {isNewMonth && <DateSection dateStr={log.dateStr} />}
              <ItemLogBlock log={log} />
            </LogItemStyled>
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

const LogItemStyled = styled.div`
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
