import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable/DetailTable.container";
import { ReactComponent as HappyCcabiImg } from "@/assets/images/happyCcabi.svg";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

const NoEventTableRow = ({
  itemStatus,
  hasNoCurrentEvent,
  navigator,
  colNum,
  phrase,
}: {
  itemStatus: itemType.NO_EVENT_CURRENT | itemType.NO_EVENT_PAST;
  hasNoCurrentEvent: boolean;
  navigator: NavigateFunction;
  colNum: number;
  phrase: {
    noEventPast: string;
    noEventCurrent: string;
  };
}) => {
  return (
    <>
      <td className="rightEnd" colSpan={colNum}>
        <NoEventDivStyled hasNoCurrentEvent={hasNoCurrentEvent}>
          <NoEventPhraseStyled hasNoCurrentEvent={hasNoCurrentEvent}>
            <div>{phrase[itemStatus]}</div>
            <CcabiStyled hasNoCurrentEvent={hasNoCurrentEvent}>
              {hasNoCurrentEvent ? <HappyCcabiImg /> : <SadCcabiImg />}
            </CcabiStyled>
          </NoEventPhraseStyled>
          {hasNoCurrentEvent ? (
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

export default NoEventTableRow;

const NoEventDivStyled = styled.div<{ hasNoCurrentEvent: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.hasNoCurrentEvent ? "space-evenly" : "center"};
  align-items: center;

  @media (max-width: 1150px) {
    justify-content: center;
    align-items: center;
    padding: 0 10px;
  }
`;

const NoEventPhraseStyled = styled.div<{ hasNoCurrentEvent: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 10px;

  & > div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const CcabiStyled = styled.div<{ hasNoCurrentEvent: boolean }>`
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
    display: ${(props) => (props.hasNoCurrentEvent ? "none" : "")};
  }
`;
