import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as HappyCcabiImg } from "@/Cabinet/assets/images/happyCcabi.svg";
import { ReactComponent as SadCcabiImg } from "@/Cabinet/assets/images/sadCcabi.svg";
import { itemType } from "@/Presentation/components/Details/DetailTable/DetailTable.container";

const NoEventTableRow = ({
  isAdmin,
  itemStatus,
  hasNoUpcomingEvent,
  navigator,
  colSpanSize,
  phrase,
}: {
  isAdmin: boolean;
  itemStatus: itemType.NO_EVENT_CURRENT | itemType.NO_EVENT_PAST;
  hasNoUpcomingEvent: boolean;
  navigator: NavigateFunction;
  colSpanSize: number;
  phrase: {
    noEventPast: string;
    noEventCurrent: string;
  };
}) => {
  return (
    <>
      {/* TODO : event 관련 current -> upcoming */}
      <td className="rightEnd" colSpan={colSpanSize}>
        <NoEventDivStyled hasNoUpcomingEvent={hasNoUpcomingEvent}>
          <NoEventPhraseStyled hasNoUpcomingEvent={hasNoUpcomingEvent}>
            <div>{phrase[itemStatus]}</div>
            <CcabiStyled hasNoUpcomingEvent={hasNoUpcomingEvent}>
              {hasNoUpcomingEvent ? <HappyCcabiImg /> : <SadCcabiImg />}
            </CcabiStyled>
          </NoEventPhraseStyled>
          {hasNoUpcomingEvent && !isAdmin ? (
            <button
              onClick={() => {
                navigator("/presentation/register");
              }}
            >
              신청하기
            </button>
          ) : null}
        </NoEventDivStyled>
      </td>
    </>
  );
};

const NoEventDivStyled = styled.div<{ hasNoUpcomingEvent: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.hasNoUpcomingEvent ? "space-evenly" : "center"};
  align-items: center;

  @media (max-width: 1150px) {
    justify-content: center;
    align-items: center;
    padding: 0 10px;
  }
`;

const NoEventPhraseStyled = styled.div<{ hasNoUpcomingEvent: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: var(--normal-text-color);

  & > div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const CcabiStyled = styled.div<{ hasNoUpcomingEvent: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  margin-left: 10px;

  & > svg {
    width: 30px;
    height: 30px;
  }

  & svg > path {
    fill: var(--normal-text-color);
  }

  & svg > g {
    fill: var(--normal-text-color);
  }

  @media (max-width: 1220px) {
    display: ${(props) => (props.hasNoUpcomingEvent ? "none" : "")};
  }
`;

export default NoEventTableRow;
