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

// interface IItemDto {
//   Sku: string;
//   ItemName: string;
//   ItemPrice: number;
//   ItemType: string;
// }
// interface IItemHistoryDto {
//   date: Date;
//   ItemDto: IItemDto;
// }

// const dummyData: { itemHistories: IItemHistoryDto[]; totalLength: number } = {
//   itemHistories: [
//     {
//       date: "2024-04-01T10:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-02T11:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-03T12:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-04T13:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-05T14:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-06T15:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-07T16:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-08T17:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-09T18:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//     {
//       date: "2024-04-10T19:00:00",
//       itemDto: {
//         Sku: "extension_31",
//         ItemName: "연장권",
//         ItemPrice: -2000,
//         ItemType: "3일",
//       },
//     },
//   ],
//   totalLength: 10,
// };

// function groupByMonthAndLimitItems(
//   itemHistories: IItemHistoryDto[],
//   limit: number = 4
// ): { [key: string]: IItemHistoryDto[] } {
//   const groupedByMonth: { [key: string]: IItemHistoryDto[] } = {};

//   itemHistories.forEach((itemHistory) => {
//     const month = itemHistory.date.substring(0, 7); // YYYY-MM 형식으로 월을 추출합니다.
//     if (!groupedByMonth[month]) {
//       groupedByMonth[month] = [];
//     }
//     if (groupedByMonth[month].length < limit) {
//       groupedByMonth[month].push(itemHistory);
//     }
//   });

//   return groupedByMonth;
// }

const ItemUsageLogPage = () => {
  // const [items, setItems] = useState();
  // const [hasMore, setHasMore] = useState(true);
  // // page 조회 페이지 수 -> 한페이지에 4개씩
  // const [page, setPage] = useState(1);
  // // size 보여주는 컴포넌트 개수
  // const [size, setSize] = useState(1);

  // // 아이템을 불러오는 함수
  // const loadItems = () => {
  //   // 페이지당 아이템 수를 정의합니다. 예: 10
  //   const perPage = 4;
  //   // 현재 페이지에 해당하는 아이템을 계산합니다.
  //   // 나중에 더미데이터를 API 호출로 대체
  //   const newItems = dummyData.itemHistories.slice(0, page * perPage);

  //   setItems(newItems);
  //   // 모든 아이템을 로드했는지 확인합니다.
  //   if (newItems.length >= dummyData.totalLength) {
  //     setHasMore(false);
  //   }
  //   const groupedData = groupByMonthAndLimitItems(dummyData.itemHistories);
  // };

  // useEffect(() => {
  //   // 컴포넌트 마운트 시 첫 페이지 로드
  //   loadItems();
  // }, [page]);

  // // 스크롤 이벤트를 처리하는 함수
  // const handleScroll = (e) => {
  //   const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
  //   // 스크롤이 끝에 도달했는지 확인
  //   if (scrollHeight - scrollTop === clientHeight) {
  //     // 추가 아이템이 더 있는지 확인 후 페이지를 업데이트
  //     if (hasMore) {
  //       setPage((prevPage) => prevPage + 1);
  //     }
  //   }
  // };

  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat("ko-KR", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   }).format(date);
  // };
  // console.log("formatDate", formatDate("2024-04-01T10:00:00"));

  return (
    <WrapperStyled>
      <TitleWrapperStyled>아이템 사용 내역</TitleWrapperStyled>
      {/* <div
        onScroll={handleScroll}
        style={{ overflowY: "auto", height: "100vh" }}
      >
        {items.map((item, index) => (
          <div key={index}>
            <p>{item.date}</p>
            <p>{ItemLogoType[item.itemDto.ItemName]}</p>
            <p>{item.itemDto.ItemPrice}</p>
            <p>{item.itemDto.ItemType}</p>
          </div>
        ))}
        {!hasMore && <p>더 이상 로드할 아이템이 없습니다.</p>}
      </div> */}
      {/* <ItemUsageLogWrapperStyled>
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
      </ItemUsageLogWrapperStyled> */}
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
