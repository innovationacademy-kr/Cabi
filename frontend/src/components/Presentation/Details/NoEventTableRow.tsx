import { NavigateFunction } from "react-router-dom";
import styled from "styled-components";
import { itemType } from "@/components/Presentation/Details/DetailTable.container";
import { noEventPhrase } from "@/components/Presentation/Details/DetailTableBodyRow.container";
import { ReactComponent as HappyCcabiImg } from "@/assets/images/happyCcabi.svg";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

const NoEventTableRow = ({
  itemStatus,
  hasNoCurrentEvent,
  navigator,
  colNum,
}: {
  itemStatus: itemType.NO_EVENT_CURRENT | itemType.NO_EVENT_PAST;
  hasNoCurrentEvent: boolean;
  navigator: NavigateFunction;
  colNum: number;
}) => {
  return (
    <td id={itemStatus} className="rightEnd" colSpan={colNum}>
      <NoEventDivStyled hasNoCurrentEvent={hasNoCurrentEvent}>
        <NoEventPhraseStyled hasNoCurrentEvent={hasNoCurrentEvent}>
          <div>{noEventPhrase[itemStatus]}</div>
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
  );
};

export default NoEventTableRow;

const NoEventDivStyled = styled.div<{ hasNoCurrentEvent: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.hasNoCurrentEvent ? "space-evenly" : "center"};
  align-items: center;
`;

const NoEventPhraseStyled = styled.div<{ hasNoCurrentEvent: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 10px;

  & > div {
    font-weight: ${(props) => (props.hasNoCurrentEvent ? "bold" : "")};
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

  @media screen and (max-width: 1220px) {
    display: ${(props) => (props.hasNoCurrentEvent ? "none" : "")};
  }
`;
