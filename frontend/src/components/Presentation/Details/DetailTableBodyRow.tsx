import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import { IItem } from "@/components/Presentation/Details/DetailTableBodyRow.container";
import DetailTableDetailTr from "@/components/Presentation/Details/DetailTableDetailTr";
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
}: {
  itemInfo: IItem;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  mobileColSpanSize: number;
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
        <td colSpan={mobileColSpanSize} id="mobileBeforeClick">
          <div className={itemInfo.itemStatus} id="mobileDateBeforeClick">
            {itemInfo.itemDateInIDate?.month}월 {itemInfo.itemDateInIDate?.day}
            일
          </div>
          <div id="mobileTitleBeforeClick">{itemInfo.item.subject}</div>
        </td>
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
      {isItemOpen ? (
        <DetailTableDetailTr
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
  background-color: #dce7fd;
  height: 70px;
  width: 100%;
  font-size: 18px;
  line-height: 70px;
  text-align: center;

  @media (min-width: 1150px) {
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

    & .leftEnd {
      border-radius: ${(props) =>
        props.open ? "10px 0 0 0" : "10px 0 0 10px"};
    }

    & .rightEnd {
      border-radius: ${(props) =>
        props.open ? "0 10px 0 0" : "0 10px 10px 0"};
    }

    & #mobileBeforeClick {
      display: none;
    }
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FB")};
  }

  @media (max-width: 1150px) {
    height: 90px;
    width: 100%;

    & > td {
      border-radius: 10px;
    }

    & #mobileDateBeforeClick {
      background-color: #3f69fd;
      height: 35px;
      line-height: 35px;
      border-radius: 10px 10px 0 0;
      color: var(--white);
      text-align: start;
      padding-left: 10px;
    }

    & #mobileTitleBeforeClick {
      height: 55px;
      line-height: 55px;
      border-radius: 0 0 10px 10px;
      padding: 0 50px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    & #webBeforeClick {
      display: none;
    }
  }
`;
