import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import {
  presentationCategoryKorean,
  presentationPeriodNumber,
} from "@/components/Presentation/Details/DetailTableBodyRow.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
import NoEventTableRow from "./NoEventTableRow";
import TableDetailTr from "./TableDetailTr";

const DetailTableBodyRow = ({
  item,
  itemStatus,
  itemDate,
  hasNoCurrentEvent,
  isItemOpen,
  handleItemClick,
  navigator,
  tableHeadEntriesWithoutDate,
}: {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
}) => {
  return (
    <>
      <TableTrStyled
        itemStatus={itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          !itemStatus && handleItemClick(item);
        }}
        open={isItemOpen}
      >
        <td className="leftEnd" id={itemStatus}>
          <div>
            {itemDate?.month}월 {itemDate?.day}일
          </div>
        </td>
        {itemStatus ? (
          <NoEventTableRow
            itemStatus={itemStatus}
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
                >
                  <div>
                    {head[0] === "subject" && item.subject}
                    {head[0] === "userName" && item.userName}
                    {head[0] === "category" &&
                      presentationCategoryKorean[item.category!]}
                    {head[0] === "presentationTime" &&
                      presentationPeriodNumber[item.presentationTime!] + "분"}
                  </div>
                </td>
              );
            })}
          </>
        )}
      </TableTrStyled>
      {isItemOpen ? (
        <TableDetailTr
          itemStatus={itemStatus}
          handleItemClick={handleItemClick}
          item={item}
          tableHeadEntriesWithoutDate={tableHeadEntriesWithoutDate}
        />
      ) : null}
    </>
  );
};

export default DetailTableBodyRow;

const TableTrStyled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  height: 70px;
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;

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
    border-radius: ${(props) => (props.open ? "10px 0 0 0" : "10px 0 0 10px")};
  }

  & .rightEnd {
    border-radius: ${(props) => (props.open ? "0 10px 0 0" : "0 10px 10px 0")};
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FB")};
  }
`;
