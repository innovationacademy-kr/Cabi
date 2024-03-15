import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/Presentation/components/Details/DetailTable/DetailTable.container";
import { IItem } from "@/Presentation/components/Details/DetailTable/DetailTableBodyItem";
import NoEventTableRow from "@/Presentation/components/Details/DetailTable/NoEventTableRow";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";

const noEventPhraseMobile = {
  noEventPast: "발표가 없었습니다",
  noEventCurrent: "지금 바로 발표를 신청해보세요",
};

const DetailTableBodyItemMiddleTr = ({
  itemInfo,
  isItemOpen,
  handleItemClick,
  mobileColSpanSize,
  navigator,
}: {
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  mobileColSpanSize: number;
  navigator: NavigateFunction;
}) => {
  return (
    <MobileMiddleTrStysled
      itemStatus={itemInfo.itemStatus}
      id={isItemOpen ? "selected" : ""}
      onClick={() => {
        !itemInfo.itemStatus && handleItemClick(itemInfo.item);
      }}
      isItemOpen={isItemOpen}
    >
      {itemInfo.itemStatus ? (
        <NoEventTableRow
          itemStatus={itemInfo.itemStatus}
          hasNoUpcomingEvent={itemInfo.hasNoUpcomingEvent}
          navigator={navigator}
          colSpanSize={mobileColSpanSize}
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

const MobileMiddleTrStysled = styled.tr<{
  itemStatus: itemType;
  isItemOpen: boolean;
}>`
  background-color: ${(props) =>
    !props.itemStatus
      ? "#dce7fd"
      : props.itemStatus === itemType.NO_EVENT_CURRENT
      ? "var(--white)"
      : "var(--full)"};
  width: 100%;
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
  padding: 0 50px;

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

  & > td {
    border-radius: ${(props) => (props.isItemOpen ? "" : "0 0 10px 10px")};
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

export default DetailTableBodyItemMiddleTr;