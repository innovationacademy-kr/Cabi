import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import DetailPartTr from "@/components/Presentation/Details/DetailPartTr";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import {
  IItem,
  noEventPhrase,
  noEventPhraseMobile,
} from "@/components/Presentation/Details/DetailTableBodyRow.container";
import NoEventTableRow from "@/components/Presentation/Details/NoEventTableRow";
import {
  PresentationCategoryTypeLabelMap,
  PresentationPeriodTypeLabelMap,
} from "@/assets/data/Presentation/maps";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import { WhiteSpaceTrStyled } from "./DetailTable";

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
      return PresentationPeriodTypeLabelMap[item.presentationTime!] + "분";
    default:
      return null;
  }
};

const DetailTableBodyRow = ({
  itemInfo,
  hasNoCurrentEvent,
  isItemOpen,
  handleItemClick,
  navigator,
  tableHeadEntriesWithoutDate,
  mobileColSpanSize,
  tableHeadEntriesWithoutDateAndSubject,
  isMobile,
}: {
  itemInfo: IItem;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  mobileColSpanSize: number;
  tableHeadEntriesWithoutDateAndSubject: [string, string][];
  isMobile: boolean;
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
        <td className="leftEnd" id="webBeforeClick">
          <div>
            {itemInfo.itemDateInIDate?.month}월 {itemInfo.itemDateInIDate?.day}
            일
          </div>
        </td>
        <td
          className={isItemOpen ? "leftEnd" : ""}
          id="mobileTopTd"
          colSpan={isItemOpen ? 0 : mobileColSpanSize}
        >
          <div className={itemInfo.itemStatus} id="mobileTopDate">
            {itemInfo.itemDateInIDate?.month}월 {itemInfo.itemDateInIDate?.day}
            일
          </div>
        </td>
        {tableHeadEntriesWithoutDateAndSubject?.map((head, idx) => {
          return (
            <td
              className={head[0] === "presentationTime" ? "rightEnd" : ""}
              key={idx}
              id="mobileTopWithoutDateTd"
            >
              <div>{renderCellDetail(head[0], itemInfo.item)}</div>
            </td>
          );
        })}
        {itemInfo.itemStatus && !isMobile ? (
          <NoEventTableRow
            itemStatus={itemInfo.itemStatus}
            hasNoCurrentEvent={hasNoCurrentEvent}
            navigator={navigator}
            colNum={tableHeadEntriesWithoutDate.length}
            phrase={noEventPhrase}
          />
        ) : (
          <>
            {tableHeadEntriesWithoutDate?.map((head, idx) => {
              return (
                <td
                  className={head[0] === "presentationTime" ? "rightEnd" : ""}
                  key={idx}
                  id="webBeforeClick"
                >
                  <div>{renderCellDetail(head[0], itemInfo.item)}</div>
                </td>
              );
            })}
          </>
        )}
      </TableTrStyled>
      <MobileMiddleTrStysled
        itemStatus={itemInfo.itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          !itemInfo.itemStatus && handleItemClick(itemInfo.item);
        }}
        open={isItemOpen}
      >
        {itemInfo.itemStatus ? (
          <NoEventTableRow
            itemStatus={itemInfo.itemStatus}
            hasNoCurrentEvent={hasNoCurrentEvent}
            navigator={navigator}
            colNum={tableHeadEntriesWithoutDate.length}
            phrase={noEventPhraseMobile}
          />
        ) : (
          <td colSpan={mobileColSpanSize}>
            <div id="mobileSubjectDiv">{itemInfo.item.subject}</div>
          </td>
        )}
      </MobileMiddleTrStysled>
      {isItemOpen ? (
        <DetailPartTr
          handleItemClick={handleItemClick}
          tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
          itemInfo={itemInfo}
          mobileColSpanSize={mobileColSpanSize}
        />
      ) : null}

      <WhiteSpaceTrStyled />
    </>
  );
};

export default DetailTableBodyRow;

export const TableTrStyled = styled.tr<{
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
    & #mobileTopWithoutDateTd {
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

    & #webBeforeClick {
      display: none;
    }

    & #mobileTopWithoutDateTd {
      display: ${(props) => (props.open ? "" : "none")};
    }

    &:hover {
      cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    }
  }
`;

const MobileMiddleTrStysled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  background-color: ${(props) =>
    !props.itemStatus
      ? "#dce7fd"
      : props.itemStatus === itemType.NO_EVENT_CURRENT
      ? "var(--white)"
      : "var(--full)"};

  height: 50px;
  width: 100%;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
  padding: 0 50px;

  & > td {
    border-radius: ${(props) => (props.open ? "" : "0 0 10px 10px")};
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
  }

  & button {
    width: 100px;
    height: 36px;
    background-color: #3f69fd;
    font-weight: bold;
    font-size: 1rem;
  }

  & > td > #mobileSubjectDiv {
    padding: 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @media (min-width: 1150px) {
    display: none;
  }
`;
