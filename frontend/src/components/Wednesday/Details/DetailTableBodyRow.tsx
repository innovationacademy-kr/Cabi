import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/components/Wednesday/Details/DetailContent.container";
import { itemType } from "@/components/Wednesday/Details/DetailTable.container";
import {
  presentationCategoryKorean,
  presentationPeriodNumber,
} from "@/components/Wednesday/Details/DetailTableBodyRow.container";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";
import NoEventTableRow from "./NoEventTableRow";
import { tableHeadArray } from "./TableHead";

const DetailTableBodyRow = ({
  item,
  itemStatus,
  itemDate,
  hasNoCurrentEvent,
  isItemOpen,
  handleItemClick,
  navigator,
}: {
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
  hasNoCurrentEvent: boolean;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  navigator: NavigateFunction;
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
          ></NoEventTableRow>
        ) : (
          <>
            {tableHeadArray.map((head, idx) => {
              let entries = Object.entries(head);
              return (
                <td
                  className={
                    entries[0][0] === "presentationTime" ? "rightEnd" : ""
                  }
                >
                  <div>
                    {entries[0][0] === "subject" && item.subject}
                    {entries[0][0] === "userName" && item.userName}
                    {entries[0][0] === "category" &&
                      presentationCategoryKorean[item.category!]}
                    {entries[0][0] === "presentationTime" &&
                      presentationPeriodNumber[item.presentationTime!]}
                  </div>
                </td>
              );
            })}
          </>
        )}
      </TableTrStyled>
      {isItemOpen ? (
        <TableDetailTrStyled
          onClick={() => {
            !itemStatus && handleItemClick(item);
          }}
          itemStatus={itemStatus}
        >
          <td colSpan={tableHeadArray.length}>
            <div>{item.detail}</div>
          </td>
        </TableDetailTrStyled>
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

const TableDetailTrStyled = styled.tr<{
  itemStatus: itemType;
}>`
  background-color: #91b5fa;
  width: 100%;

  & > td {
    border-radius: 0 0 10px 10px;
    padding: 0;
  }
  & > td > div {
    background-color: var(--white);
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 30px 50px;
    font-size: 18px;
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FA")};
  }
`;
