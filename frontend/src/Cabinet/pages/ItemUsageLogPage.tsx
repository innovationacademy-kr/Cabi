import { useEffect, useState } from "react";
import styled from "styled-components";

interface IItemUsageLog {
  date: Date;
  title: string;
}

const test: IItemUsageLog[] = [
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate()),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "이사권",
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate()),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "알림 등록권",
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate() + 1),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "연장권 - 3일", // type 이 있는 아이템의 경우 따로 처리 필요함
  },
];

const ItemUsageLogPage = () => {
  const [itemUsageLogs, setItemUsageLogs] = useState<IItemUsageLog[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<{
    [key: string]: IItemUsageLog[];
  }>({});

  useEffect(() => {
    setItemUsageLogs(test);
    const grouped = test.reduce((acc, item) => {
      const dateKey = item.date.toISOString().split("T")[0]; // 날짜 부분까지만 추출
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item); // dateKey 에 해당 dateKey 가 없으면 빈 배열 할당 후 push
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
      <TitleWrapperStyled>
        <h1>아이템 사용 내역</h1>
      </TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {Object.entries(groupedLogs).map(([date, logs]) => (
          <DateSection key={date}>
            <DateTitle>{date.replace(/-/g, ". ")}</DateTitle>
            {logs.map((log, index) => (
              <ItemUsageLogStyled key={index}>
                <IconBlockStyled>{"Icon"}</IconBlockStyled>
                <ItemUsageInfoStyled>
                  <ItemDate>{formatDate(log.date)}</ItemDate>
                  <ItemTitle>{log.title}</ItemTitle>
                </ItemUsageInfoStyled>
              </ItemUsageLogStyled>
            ))}
          </DateSection>
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
  width: 80%;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;

  & > h1 {
    font-size: 32px;
  }
`;

const ItemUsageLogWrapperStyled = styled.div`
  width: 80%;
`;

const ItemUsageLogStyled = styled.div`
  margin-top: 10px;
  border-radius: 10px;
  height: 100px;
  border: 1px solid #d9d9d9;
  display: flex;
  text-align: center;
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
  margin-left: 38px;
  margin-right: 20px;
`;

const ItemUsageInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const DateSection = styled.div`
  margin-top: 30px;
`;

const DateTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ItemDate = styled.div`
  font-size: 16px;
  word-spacing: -2px;
  color: var(--gray-color);
`;

const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
`;

export default ItemUsageLogPage;
