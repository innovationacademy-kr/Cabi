import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import {
  IItem,
  noEventPhrase,
} from "@/components/Presentation/Details/DetailTable/DetailTableBodyItem";
import NoEventTableRow from "@/components/Presentation/Details/DetailTable/NoEventTableRow";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
} from "@/assets/data/Presentation/maps";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const renderCellDetail = (
  head: string,
  item: IPresentationScheduleDetailInfo
) => {
  switch (head) {
    case "subject":
      return item.subject;
    case "userName":
      return item.userName;
    case "category":
      return PresentationCategoryTypeLabelMap[item.category!];
    case "presentationTime":
      return (
        PresentationPeriodTypeNumberLabelMap[item.presentationTime!] + "분"
      );
    case "presentationLocation":
      return PresentationLocationLabelMap[item.presentationLocation!];
    default:
      return null;
  }
};

const DetailTableBodyItemTopTr = ({
  itemInfo,
  isItemOpen,
  handleItemClick,
  isMobile,
  mobileColSpanSize,
  hasNoCurrentEvent,
  navigator,
  tableHeadEntriesWithoutDate,
  tableHeadEntries,
}: {
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  isMobile: boolean;
  mobileColSpanSize: number;
  hasNoCurrentEvent: boolean;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  tableHeadEntries: [string, string][];
}) => {
  return (
    <>
      <TableTrStyled
        itemStatus={itemInfo.itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          !itemInfo.itemStatus && handleItemClick(itemInfo.item);
        }}
        open={isItemOpen}
      >
        <td
          className={!isMobile || isItemOpen ? "leftEnd" : ""}
          colSpan={!isMobile || isItemOpen ? 0 : mobileColSpanSize}
        >
          {/* TODO :  mobileColSpanSize*/}
          <div id={!isMobile ? "" : "mobileTopDate"}>
            {itemInfo.itemDateInIDate?.month}월 {itemInfo.itemDateInIDate?.day}
            일
          </div>
        </td>
        {/* 
	- !isMobile && !itemInfo.itemStatus
	> 제목, id, 카테, 시간
	- !isMobile && itemInfo.itemStatus
	> NoEventTableRow
	- isMobile && !isItemOpen
	> x
	- isMobile && isItemOpen
	> id, 카테, 시간
	*/}
        {!isMobile ? (
          // 웹 뷰
          <>
            {itemInfo.itemStatus && (
              // 발표 없을때
              <>
                <NoEventTableRow
                  itemStatus={itemInfo.itemStatus}
                  hasNoCurrentEvent={hasNoCurrentEvent}
                  navigator={navigator}
                  colNum={tableHeadEntriesWithoutDate.length}
                  phrase={noEventPhrase}
                />
              </>
            )}
            {!itemInfo.itemStatus && (
              // 발표 있을때
              <>
                {tableHeadEntries
                  .filter((head) => head[0] !== "date")
                  .map((head, idx) => {
                    return (
                      <td
                        className={
                          head[0] === "presentationLocation" ? "rightEnd" : ""
                        }
                        key={idx}
                        title={
                          head[0] === "subject" ? itemInfo.item.subject! : ""
                        }
                      >
                        <div>{renderCellDetail(head[0], itemInfo.item)}</div>
                      </td>
                    );
                  })}
                {/* TODO: 함수나 컴포넌트로 빼기 */}
              </>
            )}
          </>
        ) : (
          // 모바일 뷰
          <>
            {!isItemOpen && <></>}
            {isItemOpen && (
              <>
                {tableHeadEntries
                  .filter((head) => head[0] !== "subject" && head[0] !== "date")
                  .map((head, idx) => {
                    return (
                      <td
                        className={
                          head[0] === "presentationLocation" ? "rightEnd" : ""
                        }
                        key={idx}
                      >
                        <div>{renderCellDetail(head[0], itemInfo.item)}</div>
                      </td>
                    );
                  })}
              </>
            )}
          </>
        )}
      </TableTrStyled>
    </>
  );
};

export default DetailTableBodyItemTopTr;

const TableTrStyled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  width: 100%;
  text-align: center;

  @media (min-width: 1150px) {
    font-size: 18px;
    background-color: ${(props) =>
      !props.itemStatus
        ? "#dce7fd"
        : props.itemStatus === itemType.NO_EVENT_CURRENT
        ? "var(--white)"
        : "var(--full)"};
    height: 70px;
    line-height: 70px;

    & > td {
      padding: 0 10px;
    }

    & > td > div {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    & button {
      width: 120px;
      height: 36px;
      background-color: #3f69fd;
      font-weight: bold;
      font-size: 1rem;
    }

    & #mobileTopTd {
      display: none;
    }

    &:hover {
      cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
      background-color: ${(props) => (props.itemStatus ? "" : "#91B5FB")};
    }
  }

  & .leftEnd {
    border-radius: ${(props) => (props.open ? "10px 0 0 0" : "10px 0 0 10px")};
  }

  & .rightEnd {
    border-radius: ${(props) => (props.open ? "0 10px 0 0" : "0 10px 10px 0")};
  }

  @media (max-width: 1150px) {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    width: 100%;
    background-color: ${(props) => (props.open ? "#91B5FB" : "#3f69fd")};

    & > td {
      border-radius: ${(props) => (props.open ? "" : "10px 10px 0 0")};
    }

    & > td > #mobileTopDate {
      color: ${(props) => (props.open ? "var(--black)" : "var(--white)")};
      text-align: ${(props) => (props.open ? "center" : "start")};
      padding-left: 10px;
    }

    &:hover {
      cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    }
  }
`;
