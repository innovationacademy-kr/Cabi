import { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import UnavailableDataInfo from "@/Cabinet/components/Common/UnavailableDataInfo";
import ItemLogBlock from "@/Cabinet/components/Store/ItemUsageLog/ItemLogBlock";
import { ItemIconMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as DropdownChevron } from "@/Cabinet/assets/images/dropdownChevron.svg";
import { StoreItemType } from "@/Cabinet/types/enum/store.enum";
import { axiosGetItemUsageHistory } from "@/Cabinet/api/axios/axios.custom";

const mapItemNameToType = (itemName: string): StoreItemType => {
  switch (itemName) {
    case "연장권":
      return StoreItemType.EXTENSION;
    case "이사권":
      return StoreItemType.SWAP;
    case "알림 등록권":
      return StoreItemType.ALARM;
    case "페널티 감면권":
      return StoreItemType.PENALTY;
    default:
      return StoreItemType.PENALTY;
  }
};

export interface IItemUsageLog {
  date: Date;
  dateStr?: string;
  titleWithDetails: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  itemName: string;
}

function createLogEntries(data: { result: any[] }) {
  return data.result.map((item) => {
    const itemDate = new Date(item.date);

    return {
      date: itemDate,
      dateStr: `${itemDate.getFullYear()}년 ${itemDate.getMonth() + 1}월`,
      titleWithDetails:
        item.itemDto.itemName === item.itemDto.itemDetails
          ? item.itemDto.itemName
          : `${item.itemDto.itemName} - ${item.itemDto.itemDetails}`,
      logo: ItemIconMap[mapItemNameToType(item.itemDto.itemName)],
      itemName: item.itemDto.itemName,
    };
  });
}

const ItemUsageLogPage = () => {
  const [itemUsageLogs, setItemUsageLogs] = useState<IItemUsageLog[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasAdditionalLogs, sethasAdditionalLogs] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const size = 5;

  const getItemUsageLog = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const data = await axiosGetItemUsageHistory(page, size);
      const newLogs = createLogEntries(data);
      setItemUsageLogs((prevLogs) => [...prevLogs, ...newLogs]);
      sethasAdditionalLogs(data.result.length === size);
    } catch (error) {
      console.error("Failed to fetch item usage history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItemUsageLog(page, size);
  }, [page]);

  const handleMoreClick = () => {
    setPage((prev) => prev + 1);
  };

  return itemUsageLogs.length > 0 ? (
    <WrapperStyled>
      <TitleWrapperStyled>아이템 사용내역</TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {itemUsageLogs.map((log, idx, logs) => {
          const isNewMonth = idx === 0 || log.dateStr !== logs[idx - 1].dateStr;
          return (
            <LogItemStyled key={idx}>
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
              <DropdownChevron />
            </MoreButtonStyled>
          </ButtonContainerStyled>
        )}
      </ItemUsageLogWrapperStyled>
    </WrapperStyled>
  ) : (
    <UnavailableDataInfo msg="아이템 사용내역이 없습니다." />
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 100px 0;
`;

const TitleWrapperStyled = styled.div`
  font-size: 32px;
  width: 80%;
  font-weight: 700;
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

const ItemUsageLogWrapperStyled = styled.div`
  width: 70%;

  @media (max-width: 1040px) {
    width: 80%;
  }
`;

const LogItemStyled = styled.div`
  margin-top: 20px;
`;

const DateSectionStyled = styled.div`
  margin-top: 40px;
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
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreButtonStyled = styled.button<{
  isLoading: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 50px;
  margin: 20px auto;
  border: 1px solid var(--sys-main-color);
  border-radius: 30px;
  background-color: var(--white);
  color: var(--sys-main-color);
  position: relative;
  padding: 0 15px;

  svg {
    margin-left: 18px;
    margin-bottom: -2px;
    width: 13px;
    height: 9px;
  }
`;

export default ItemUsageLogPage;
