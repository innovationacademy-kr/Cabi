import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPresentationState } from "@/recoil/atoms";
import { IDate } from "@/components/Presentation/Details/DetailContent.container";
import {
  TAdminModalState,
  itemType,
} from "@/components/Presentation/Details/DetailTable.container";
<<<<<<< Updated upstream
import { IPresentationScheduleDetailInfo } from "@/types/dto/Presentation.dto";
=======
import { IPresentationScheduleDetailInfo } from "@/types/dto/presentation.dto";
>>>>>>> Stashed changes

const DetailTableBodyRowMobile = ({
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
  const setCurrentPresentation = useSetRecoilState(currentPresentationState);
  const [handleColSpan, setHandleColSpan] = useState(3);
  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (isAdmin && !itemStatus) {
      setCurrentPresentation({
        id: item.id,
        dateTime: item.dateTime,
        presentationTime: item.presentationTime,
        presentationStatus: item.presentationStatus,
        presentationLocation: item.presentationLocation,
        detail: item.detail,
      });
      openAdminModal("statusModal");
    } else {
      if (clickedItem?.dateTime === item.dateTime) {
        setHandleColSpan(3);
        setClickedItem(null);
      } else {
        setHandleColSpan(4);
        setClickedItem(item);
      }
    }
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

  return (
    <>
      {clickedItem?.dateTime === item.dateTime ? (
        <TopTableDetailTrStyled
          onClick={() => {
            !itemStatus && handleItemClick(item);
          }}
        >
          <td>
            <div className="leftEnd">
              <div>
                {itemDate?.month}월 {itemDate?.day}일
              </div>
            </div>{" "}
          </td>
          <td>
            <div>{item.userName}</div>
          </td>
          <td>
            <div>{presentationCategoryKorean[item.category!]}</div>
          </td>
          <td>
            <div className="rightEnd">
              {presentationPeriodNumber[item.presentationTime!]}분
            </div>
          </td>
        </TopTableDetailTrStyled>
      ) : null}
      <MobileTableStyled
        id={clickedItem?.dateTime === item.dateTime ? "selected" : ""}
        onClick={() => {
          !itemStatus && handleItemClick(item);
        }}
        open={clickedItem?.dateTime === item.dateTime}
      >
        {itemStatus ? (
          <>
            <td className="leftEnd" id={itemStatus}>
              <div>
                {itemDate?.month}월 {itemDate?.day}일
              </div>
            </td>
            <td id={itemStatus} className="rightEnd" colSpan={3}>
              <NoEventDivStyled>
                {itemStatus === itemType.NO_EVENT_PAST ? (
                  <>
                    <div>발표가 없었습니다</div>
                  </>
                ) : (
                  <>
                    <NoEventPhraseStyled>
                      <div>지금 바로 발표를 신청해보세요</div>
                    </NoEventPhraseStyled>
                    <button
                      onClick={() => {
                        navigator("/Presentation/register");
                      }}
                    >
                      신청하기
                    </button>
                  </>
                )}
              </NoEventDivStyled>
            </td>
          </>
        ) : (
          <>
            {clickedItem?.dateTime === item.dateTime ? null : (
              <td className="leftEnd" id={itemStatus}>
                <div>
                  {itemDate?.month}월 {itemDate?.day}일
                </div>
              </td>
            )}
            <td colSpan={handleColSpan} className="rightEnd">
              <div id="MobileSubject">{item.subject}</div>
            </td>
          </>
        )}
      </MobileTableStyled>
      {clickedItem?.dateTime === item.dateTime ? (
        <>
          <TableDetailTrStyled
            onClick={() => {
              !itemStatus && handleItemClick(item);
            }}
          >
            <td colSpan={4}>
              <div>{item.detail}</div>
            </td>
          </TableDetailTrStyled>
        </>
      ) : null}
    </>
  );
};

export default DetailTableBodyRowMobile;

const MobileTableStyled = styled.tr<{
  open?: boolean;
}>`
  height: 70px;
  width: 100%;

  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;

  & #noEventCurrent {
    background-color: var(--white);
  }

  & #noEventPast {
    background-color: var(--full);
  }

  & button {
    width: 100px;
    height: 36px;
    background-color: #3f69fd;
    font-weight: bold;
    font-size: 1rem;
  }

  & .leftEnd {
    border-radius: ${(props) => (props.open ? "10px 0 0 0" : "10px 0 0 10px")};
    padding-left: 5px;
    > div {
      height: 100%;
      /* word-break: keep-all;  */
    }
  }

  & .rightEnd {
    border-radius: ${(props) => (props.open ? "0 0 0 0" : "0 10px 10px 0")};
    > div {
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      /* text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap; */
    }
  }

  @media screen and (min-width: 1150px) {
    display: none;
  }
`;

const TableDetailTrStyled = styled.tr`
  background-color: #91b5fa;

  line-height: 30px;
  & > td {
    border-radius: 0 0 10px 10px;
    padding: 0;
  }
  & > td > div {
    background-color: white;
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 20px 50px;
    font-size: 18px;
  }
  @media screen and (min-width: 1150px) {
    display: none;
  }
`;
const TopTableDetailTrStyled = styled.tr`
  background-color: #91b5fa;
  width: 100%;
  & > td {
    border-radius: 10px 10px 0 0;
    padding: 0;
  }
  & > td > div {
    line-height: 24px;
    font-size: 18px;
    text-align: center;
    padding: 15px 0 0 5px;
    background-color: #91b5fa;
  }
  & .leftEnd {
    border-radius: 10px 0 0px 0px;
  }

  & .rightEnd {
    border-radius: 0px 10px 0px 0px;
  }
  @media screen and (min-width: 1150px) {
    display: none;
  }
`;

const NoEventDivStyled = styled.div`
  height: 70px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  justify-content: end;
  width: 50%;

  & > div {
    font-weight: bold;
    line-height: 30px;
  }
`;
