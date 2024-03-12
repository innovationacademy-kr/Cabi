import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import DetailPartTr from "@/components/Presentation/Details/DetailPartTr";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import { IItem } from "@/components/Presentation/Details/DetailTableBodyRow.container";
import NoEventTableRow from "@/components/Presentation/Details/NoEventTableRow";
import {
  PresentationCategoryTypeLabelMap,
  PresentationPeriodTypeLabelMap,
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
}: {
  itemInfo: IItem;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  mobileColSpanSize: number;
  tableHeadEntriesWithoutDateAndSubject: [string, string][];
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
        {itemInfo.itemStatus ? (
          <NoEventTableRow
            itemStatus={itemInfo.itemStatus}
            hasNoCurrentEvent={hasNoCurrentEvent}
            navigator={navigator}
            colNum={tableHeadEntriesWithoutDate.length}
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
      <MobileSubjectTrStysled
        itemStatus={itemInfo.itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          !itemInfo.itemStatus && handleItemClick(itemInfo.item);
        }}
        open={isItemOpen}
      >
        <td colSpan={mobileColSpanSize}>
          <div>{itemInfo.item.subject}</div>
        </td>
      </MobileSubjectTrStysled>
      {isItemOpen ? (
        <DetailPartTr
          handleItemClick={handleItemClick}
          tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
          itemInfo={itemInfo}
          mobileColSpanSize={mobileColSpanSize}
        />
      ) : null}
    </>
  );
};

export default DetailTableBodyRow;

export const TableTrStyled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  width: 100%;
  font-size: 18px;
  text-align: center;

  @media (min-width: 1150px) {
    background-color: #dce7fd;
    height: 70px;
    line-height: 70px;

    & > td {
      padding: 0 10px;
    }

    & #noEventCurrent {
      background-color: var(--white);
    }

    & #noEventPast {
      background-color: var(--full);
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

const MobileSubjectTrStysled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  background-color: #dce7fd;
  height: 55px;
  width: 100%;
  font-size: 18px;
  line-height: 55px;
  text-align: center;
  padding: 0 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  & > td {
    border-radius: ${(props) => (props.open ? "" : "0 0 10px 10px")};
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
  }

  @media (min-width: 1150px) {
    display: none;
  }
`;
