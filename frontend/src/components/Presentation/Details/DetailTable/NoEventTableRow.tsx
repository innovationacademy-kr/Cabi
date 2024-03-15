import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import { ReactComponent as HappyCcabiImg } from "@/assets/images/happyCcabi.svg";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

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
          {hasNoUpcomingEvent && (
            <button
              onClick={() => {
                navigator("/presentation/register");
              }}
            >
              신청하기
            </button>
          )}
        </NoEventDivStyled>
      </td>
    </>
  );
};

export default NoEventTableRow;

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
    fill: var(--black);
  }

  @media (max-width: 1220px) {
    display: ${(props) => (props.hasNoUpcomingEvent ? "none" : "")};
  }
`;
