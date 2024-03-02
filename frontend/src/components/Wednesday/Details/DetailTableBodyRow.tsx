import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import {
  TAdminModalState,
  itemType,
} from "@/components/Wednesday/Details/DetailTable";
import { ReactComponent as HappyCcabiImg } from "@/assets/images/happyCcabi.svg";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

const DetailTableBodyRow = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  itemDate,
  hasNoCurrentEvent,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
  hasNoCurrentEvent: boolean;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();
  const noEventPhrase = {
    noEventPast: "수요지식회가 열리지 않았습니다",
    noEventCurrent:
      "다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를 신청해보세요",
  };
  const [isItemOpen, setIsItemOpen] = useState<boolean>(false);

  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (clickedItem?.dateTime === item.dateTime) setClickedItem(null);
    else setClickedItem(item);
  };

  const presentationPeriodNumber = {
    HALF: 30,
    HOUR: 60,
    HOUR_HALF: 90,
    TWO_HOUR: 120,
  };

  const presentationCategoryKorean = {
    DEVELOP: "개발",
    HOBBY: "취미",
    JOB: "취업",
    ETC: "기타",
    TASK: "42",
    STUDY: "학술",
  };

  useEffect(() => {
    setIsItemOpen(clickedItem?.dateTime === item.dateTime);
  }, [clickedItem]);

  return (
    <>
      <TableTrStyled
        itemStatus={itemStatus}
        id={isItemOpen ? "selected" : ""}
        onClick={() => {
          isAdmin && !itemStatus && openAdminModal("statusModal");
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
          <td id={itemStatus} className="rightEnd" colSpan={4}>
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
                    navigator("/wed/register");
                  }}
                >
                  신청하기
                </button>
              ) : null}
            </NoEventDivStyled>
          </td>
        ) : (
          <>
            <td>
              <div>{item.subject}</div>
            </td>
            <td>
              <div>{item.userName}</div>
            </td>
            <td>
              <div id="MobileCategory">
                {presentationCategoryKorean[item.category!]}
              </div>
            </td>
            <td className="rightEnd" id="MobilePeriod">
              <div>{presentationPeriodNumber[item.presentationTime!]}분</div>
            </td>
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
          <td colSpan={5}>
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
