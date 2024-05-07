import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import ItemLogBlock from "@/Cabinet/components/Store/ItemUsageLog/ItemLogBlock";
import { IItemUsageLog } from "@/Cabinet/components/Store/ItemUsageLog/ItemLogBlock";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosGetItemUsageHistory } from "@/Cabinet/api/axios/axios.custom";

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

function createLogEntries(data: { result: any[] }) {
  return data.result.map((item) => ({
    date: new Date(item.date),
    title:
      item.itemDto.itemName === item.itemDto.itemDetails
        ? item.itemDto.itemName
        : `${item.itemDto.itemName} - ${item.itemDto.itemDetails}`,
    logo: ItemIconMap[mapItemNameToType(item.itemDto.itemName)],
    dateStr: `${new Date(item.date).getFullYear()}년 ${
      new Date(item.date).getMonth() + 1
    }월`,
  }));
}

const ItemUsageLogPage = () => {
  const [itemUsageLogs, setItemUsageLogs] = useState<IItemUsageLog[]>([]);
  const [page, setPage] = useState(0);
  const [hasAdditionalLogs, sethasAdditionalLogs] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const size = 5;

  useEffect(() => {
    getItemUsageLog(page, size);
  }, [page]);

  const getItemUsageLog = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const data = await axiosGetItemUsageHistory(page, size);
      const newLogs = createLogEntries(data);
      setItemUsageLogs((prevLogs) => [...prevLogs, ...newLogs]);
      sethasAdditionalLogs(data.result.length === size);
    } catch (error) {
      console.error("Failed to fetch item usage history:", error);
    }
    setIsLoading(false);
  };

  const handleMoreClick = () => {
    setPage((prev) => prev + 1);
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
              {isNewMonth && (
                <DateSectionStyled>
                  <DateTitleStyled>{log.dateStr}</DateTitleStyled>
                </DateSectionStyled>
              )}
              <ItemLogBlock log={log} />
            </LogItemStyled>
          );
        })}
        {hasAdditionalLogs && (
          <ButtonContainerStyled>
            <MoreButtonStyled
              onClick={handleMoreClick}
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? <LoadingAnimation /> : "더보기"}
            </MoreButtonStyled>
          </ButtonContainerStyled>
        )}
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

const ButtonContainerStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button<{
  isLoading: boolean;
}>`
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;
`;

export default ItemUsageLogPage;
