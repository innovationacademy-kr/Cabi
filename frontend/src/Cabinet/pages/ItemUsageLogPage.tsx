import { useEffect, useState } from "react";
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
    logo: MoveImg,
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
    logo: AlarmImg,
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate() + 1),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "연장권 - 3일",
    logo: ExtensionImg,
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate() + 1),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "페널티 축소권",
    logo: PenaltyImg,
  },
  {
    date: new Date(
      Number(new Date().getFullYear()),
      Number(new Date().getMonth()),
      Number(new Date().getDate() + 2),
      Number(new Date().getHours()),
      Number(new Date().getMinutes())
    ),
    title: "연장권 - 15일", // type 이 있는 아이템의 경우 따로 처리 필요함
    logo: ExtensionImg,
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
      <TitleWrapperStyled>아이템 사용 내역</TitleWrapperStyled>
      <ItemUsageLogWrapperStyled>
        {Object.entries(groupedLogs).map(([date, itemUsageLogs]) => (
          <DateSectionStyled key={date}>
            <DateTitleStyled>{date.replace(/-/g, ". ")}</DateTitleStyled>
            {itemUsageLogs.map((itemUsageLog, index) => (
              <ItemUsageLogStyled key={index}>
                <IconBlockStyled>
                  <itemUsageLog.logo />
                </IconBlockStyled>
                <ItemUsageInfoStyled>
                  <ItemDateStyled>
                    {formatDate(itemUsageLog.date)}
                  </ItemDateStyled>
                  <ItemTitleStyled>{itemUsageLog.title}</ItemTitleStyled>
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
  height: 90px;
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

const DateSectionStyled = styled.div`
  margin-top: 30px;
`;

const DateTitleStyled = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
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
