import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/Presentation/components/Details/DetailTable/DetailTable.container";
import { IItem } from "@/Presentation/components/Details/DetailTable/DetailTableBodyItem";
import NoEventTableRow from "@/Presentation/components/Details/DetailTable/NoEventTableRow";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
  PresentationStatusTypeLabelMap,
} from "@/Presentation/assets/data/maps";
import { IPresentationScheduleDetailInfo } from "@/Presentation/types/dto/presentation.dto";
import { PresentationStatusType } from "@/Presentation/types/enum/presentation.type.enum";

const noEventPhraseDesktop = {
  noEventPast: "수요지식회가 열리지 않았습니다",
  noEventCurrent:
    "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
};

const renderTableData = (
  className: string,
  key: number,
  title: string,
  head: string,
  item: IPresentationScheduleDetailInfo
) => {
  return (
    <td className={className} key={key} title={title}>
      <div>{renderCellDetail(head, item)}</div>
    </td>
  );
};

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
    case "presentationStatus":
      return PresentationStatusTypeLabelMap[item.presentationStatus!];
    default:
      return null;
  }
};

const DetailTableBodyItemTopTr = ({
  isAdmin,
  itemInfo,
  isItemOpen,
  handleItemClick,
  isMobile,
  mobileColSpanSize,
  navigator,
  tableHeadEntriesWithoutDate,
  tableHeadEntriesWithoutDateAndSubject,
}: {
  isAdmin: boolean;
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  isMobile: boolean;
  mobileColSpanSize: number;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  tableHeadEntriesWithoutDateAndSubject: [string, string][];
}) => {
  const isClickable = (): boolean => {
    if (itemInfo.item.presentationStatus !== PresentationStatusType.CANCEL) {
      return isAdmin || !itemInfo.itemStatus;
    }
    return false;
  };

  return (
    <>
      <TopTrStyled
        isAdmin={isAdmin}
        itemStatus={itemInfo.itemStatus}
        id={isItemOpen ? "selected" : ""}
        presentationStatus={itemInfo.item.presentationStatus}
        onClick={() => {
          isClickable() && handleItemClick(itemInfo.item);
        }}
        open={isItemOpen}
      >
        {/* date cell */}
        <td
          className={!isMobile || isItemOpen ? "leftEnd" : ""}
          colSpan={!isMobile || isItemOpen ? 0 : mobileColSpanSize}
        >
          <div id={!isMobile ? "desktopTopDate" : "mobileTopDate"}>
            {itemInfo.itemDateInIDate?.month}월 {itemInfo.itemDateInIDate?.day}
            일
          </div>
        </td>
        {!isMobile ? (
          // 웹 뷰
          <>
            {itemInfo.itemStatus && (
              // 발표 없을때
              <>
                <NoEventTableRow
                  isAdmin={isAdmin}
                  itemStatus={itemInfo.itemStatus}
                  hasNoUpcomingEvent={itemInfo.hasNoUpcomingEvent}
                  navigator={navigator}
                  colSpanSize={tableHeadEntriesWithoutDate.length}
                  phrase={noEventPhraseDesktop}
                />
              </>
            )}
            {!itemInfo.itemStatus && (
              // 발표 있을때
              <>
                {tableHeadEntriesWithoutDate.map((head, idx) => {
                  return renderTableData(
                    (!isAdmin && head[0] === "presentationLocation") ||
                      (isAdmin && head[0] === "presentationStatus")
                      ? "rightEnd"
                      : "",
                    idx,
                    head[0] === "subject" ? itemInfo.item.subject ?? "" : "",
                    head[0],
                    itemInfo.item
                  );
                })}
              </>
            )}
          </>
        ) : (
          // 모바일 뷰
          <>
            {!isItemOpen && <></>}
            {isItemOpen && (
              <>
                {tableHeadEntriesWithoutDateAndSubject.map((head, idx) => {
                  return renderTableData(
                    head[0] === "presentationLocation" ? "rightEnd" : "",
                    idx,
                    "",
                    head[0],
                    itemInfo.item
                  );
                })}
              </>
            )}
          </>
        )}
      </TopTrStyled>
    </>
  );
};
export default DetailTableBodyItemTopTr;

const TopTrStyled = styled.tr<{
  isAdmin: boolean;
  itemStatus: itemType;
  open?: boolean;
  presentationStatus: PresentationStatusType | null;
}>`
  width: 100%;
  text-align: center;
  & .leftEnd {
    border-radius: ${(props) => (props.open ? "10px 0 0 0" : "10px 0 0 10px")};
  }
  & .rightEnd {
    border-radius: ${(props) => (props.open ? "0 10px 0 0" : "0 10px 10px 0")};
  }
  & > td > div {
    color: var(--mine-text-color);
  }
  & #desktopTopDate {
    color: ${(props) =>
      !props.itemStatus
        ? "var(--mine-text-color)"
        : "var(--normal-text-color)"};
  }

  @media (min-width: 1150px) {
    font-size: 18px;
    background-color: ${(props) =>
      !props.itemStatus
        ? "var(--presentation-detail-available-color)"
        : props.itemStatus === itemType.NO_EVENT_CURRENT
        ? "var(--presentation-no-event-cur-color)"
        : "var(--presentation-no-event-past-color)"};
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
      background-color: var(--sys-main-color);
      font-weight: bold;
      font-size: 1rem;
    }
    &:hover {
      cursor: ${(props) => {
        if (props.presentationStatus === PresentationStatusType.CANCEL)
          return "";
        else if (props.isAdmin) return "pointer";
        else return props.itemStatus ? "" : "pointer";
      }};
      background-color: ${(props) => {
        if (props.presentationStatus === PresentationStatusType.CANCEL)
          return "";
        else if (props.isAdmin) return "#91B5FB";
        else return props.itemStatus ? "" : "#91B5FB";
      }};
    }
  }
  @media (max-width: 1150px) {
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    width: 100%;
    background-color: ${(props) =>
      props.open ? "#91B5FB" : "var(--sys-main-color)"};
    & > td {
      border-radius: ${(props) => (props.open ? "" : "10px 10px 0 0")};
    }
    & > td > #mobileTopDate {
      color: ${(props) =>
        props.open
          ? "var(--mine-text-color)"
          : "var(--white-text-with-bg-color)"};
      text-align: ${(props) => (props.open ? "center" : "start")};
      padding-left: 10px;
    }
    &:hover {
      cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    }
    & > td > div {
      color: var(--mine-text-color);
    }
  }
`;
