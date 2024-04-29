import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as AlarmImg } from "@/Cabinet/assets/images/storeAlarm.svg";
import { ReactComponent as ExtensionImg } from "@/Cabinet/assets/images/storeExtension.svg";
import { ReactComponent as MoveImg } from "@/Cabinet/assets/images/storeMove.svg";
import { ReactComponent as PenaltyImg } from "@/Cabinet/assets/images/storePenalty.svg";

interface IItemUsageLog {
  date: Date;
  title: string;
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const dummyData = {
  itemHistories: [
    {
      date: "2024-04-01T10:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "페널티 축소권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-02T11:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-03T12:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-04T13:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-05T14:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-06T15:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
    {
      date: "2024-04-07T16:00:00",
      itemDto: {
        Sku: "extension_31",
        ItemName: "연장권",
        ItemPrice: -2000,
        ItemType: "3일",
      },
    },
  ],
  totalLength: 10,
};

function getLogo(ItemName: string) {
  switch (ItemName) {
    case "연장권":
      return ExtensionImg;
    case "이사권":
      return MoveImg;
    case "알림 등록권":
      return AlarmImg;
    case "페널티 축소권":
      return PenaltyImg;
    default:
      return ExtensionImg;
  }
}

const ItemUsageLogPage = () => {
  const [itemUsageLogs, setItemUsageLogs] = useState<IItemUsageLog[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<{
    [key: string]: IItemUsageLog[];
  }>({});

  useEffect(() => {
    const formattedLogs = dummyData.itemHistories.map((item) => ({
      date: new Date(item.date),
      title: `${item.itemDto.ItemName} - ${item.itemDto.ItemType}`,
      logo: getLogo(item.itemDto.ItemName),
      // TODO: getLogo 함수가 아닌 maps.ts에 있는 ItemIconMap을 사용하도록 수정
    }));

    setItemUsageLogs(formattedLogs);

    // TODO: 날짜를 날짜 기준이 아니라 달 기준으로 띄워주도록 수정
    const grouped = formattedLogs.reduce((acc, item) => {
      const dateKey = item.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {} as { [key: string]: IItemUsageLog[] });
    setGroupedLogs(grouped);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  return (
    <WrapperStyled>
      <TitleWrapperStyled>아이템 사용 내역</TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <DateSectionStyled key={date}>
            <DateTitleStyled>{date.replace(/-/g, ". ")}</DateTitleStyled>
            {logs.map((log, index) => (
              <ItemUsageLogStyled key={index}>
                <IconBlockStyled>
                  <log.logo />
                </IconBlockStyled>
                <ItemUsageInfoStyled>
                  <ItemDateStyled>{formatDate(log.date)}</ItemDateStyled>
                  <ItemTitleStyled>{log.title}</ItemTitleStyled>
                </ItemUsageInfoStyled>
              </ItemUsageLogStyled>
            ))}
          </DateSectionStyled>
        ))}
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

const DateSectionStyled = styled.div`
  margin-top: 30px;
`;

const DateTitleStyled = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ItemUsageLogStyled = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  height: 90px;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
`;

const IconBlockStyled = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: var(--main-color);
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-right: 20px;
  svg {
    width: 40px;
    height: 40px;
  }
`;

const ItemUsageInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const ItemDateStyled = styled.div`
  font-size: 16px;
  word-spacing: -2px;
  color: var(--gray-color);
`;

const ItemTitleStyled = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

export default ItemUsageLogPage;
