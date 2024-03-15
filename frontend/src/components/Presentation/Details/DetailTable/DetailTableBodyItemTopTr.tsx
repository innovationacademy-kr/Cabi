import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import { IItem } from "@/components/Presentation/Details/DetailTable/DetailTableBodyItem";
import NoEventTableRow from "@/components/Presentation/Details/DetailTable/NoEventTableRow";
import {
  PresentationCategoryTypeLabelMap,
  PresentationLocationLabelMap,
  PresentationPeriodTypeNumberLabelMap,
  PresentationStatusTypeLabelMap,
} from "@/assets/data/Presentation/maps";
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";

const noEventPhraseDesktop = {
  noEventPast: "수요지식회가 열리지 않았습니다",
  noEventCurrent:
    "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
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
  itemInfo: IItem;
  isItemOpen: boolean;
  handleItemClick: (item: IPresentationScheduleDetailInfo) => void;
  isMobile: boolean;
  mobileColSpanSize: number;
  navigator: NavigateFunction;
  tableHeadEntriesWithoutDate: [string, string][];
  tableHeadEntriesWithoutDateAndSubject: [string, string][];
  isAdmin: boolean;
}) => {
  return (
    <>
      <TopTrStyled
        itemStatus={itemInfo.itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          !itemInfo.itemStatus && handleItemClick(itemInfo.item);
        }}
        open={isItemOpen}
      >
        {/* date cell */}
        <td
          className={!isMobile || isItemOpen ? "leftEnd" : ""}
          colSpan={!isMobile || isItemOpen ? 0 : mobileColSpanSize}
        >
          <div id={!isMobile ? "" : "mobileTopDate"}>
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
                  return (
                    <td
                      /* 
                      NOTE : 
                      admin 페이지가 아니고 && 발표장소 || admin 페이지고 && 발표상태면
                      border-radius 적용
                      */
                      className={
                        (!isAdmin && head[0] === "presentationLocation") ||
                        (isAdmin && head[0] === "presentationStatus")
                          ? "rightEnd"
                          : ""
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
                {tableHeadEntriesWithoutDateAndSubject.map((head, idx) => {
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
      </TopTrStyled>
    </>
  );
};

export default DetailTableBodyItemTopTr;

const TopTrStyled = styled.tr<{
  itemStatus: itemType;
  open?: boolean;
}>`
  width: 100%;
  text-align: center;

  & .leftEnd {
    border-radius: ${(props) => (props.open ? "10px 0 0 0" : "10px 0 0 10px")};
  }

  & .rightEnd {
    border-radius: ${(props) => (props.open ? "0 10px 0 0" : "0 10px 10px 0")};
  }

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

    &:hover {
      cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
      background-color: ${(props) => (props.itemStatus ? "" : "#91B5FB")};
    }
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
