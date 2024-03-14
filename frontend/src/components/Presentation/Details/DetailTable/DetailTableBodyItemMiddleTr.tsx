import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import {
  IItem,
  noEventPhraseMobile,
} from "@/components/Presentation/Details/DetailTable/DetailTableBodyItem";
import NoEventTableRow from "@/components/Presentation/Details/DetailTable/NoEventTableRow";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const DetailTableBodyItemMiddleTr = ({
  itemInfo,
  isItemOpen,
  handleItemClick,
  mobileColSpanSize,
  hasNoCurrentEvent,
  navigator,
  tableHeadEntriesWithoutDate,
}: {
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  mobileColSpanSize: number;
  hasNoCurrentEvent: boolean;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
}) => {
  return (
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
  );
};

export default DetailTableBodyItemMiddleTr;
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