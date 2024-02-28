import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import {
  TAdminModalState,
  WhiteSpaceTrStyled,
  itemType,
} from "@/components/Wednesday/Details/DetailTable";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

const DetailTableBodyMobile = ({
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
  const [handleColSpan, setHandleColSpan] = useState(4);
  const handleItemClick = (item: IPresentationScheduleDetailInfo) => {
    if (clickedItem?.dateTime === item.dateTime) {
      setHandleColSpan(4);
      setClickedItem(null);
    } else {
      setHandleColSpan(5);
      setClickedItem(item);
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
        <TopTableDetailTrStyled onClick={() => {
          !itemStatus && handleItemClick(item);
        }}>
          <td className="leftEnd" colSpan={2} id={itemStatus}>
            <div>
              {itemDate?.month}월 {itemDate?.day}일
            </div>
          </td>
          <td >
            <div>{item.userName}</div>
          </td>
          <td>
            <div>{presentationCategoryKorean[item.category!]}</div>
          </td>
          <td className="rightEnd">
            <div>{presentationPeriodNumber[item.period!]}분</div>
          </td>
        </TopTableDetailTrStyled>
      ) : null}
      <MobileTableStyled
        id={clickedItem?.dateTime === item.dateTime ? "selected" : ""}
        onClick={() => {
          isAdmin && openAdminModal("statusModal");
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
            <td id={itemStatus} className="rightEnd" colSpan={4}>
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
                        navigator("/wed/register");
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
          <TableDetailTrStyled onClick={() => {
          !itemStatus && handleItemClick(item);
        }}>
            <td colSpan={5}>
              <div>
                "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데?" 장비 탓인가
                싶어서 최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒
                취미로 시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간
                사진 강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기
                쉽게 알려드립니다!
              </div>
            </td>
          </TableDetailTrStyled>
        </>
      ) : null}
      <WhiteSpaceTrStyled />
    </>
  );
};

export default DetailTableBodyMobile;

const MobileTableStyled = styled.tr<{
  open?: boolean;
}>`
  height: 70px;
  width: 100%;
  /* line-height: 70px; */
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;

  & > td {
    padding: 0 10px;
  }

  & #MobileSubject {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  & #noEventCurrent {
    background-color: white;
  }

  & #noEventPast {
    background-color: #eeeeee;
  }

  & > td > div {
    /* text-overflow: ellipsis;
    overflow: hidden; */
    /* white-space: nowrap; */
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
    border-radius: ${(props) => (props.open ? "0 0 0 0" : "0 10px 10px 0")};
  }

  @media screen and (min-width: 1150px) {
    display: none;
  }
`;

const TableDetailTrStyled = styled.tr`
  background-color: #91b5fa;
  width: 100%;
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
    padding: 0;
  }
  & > td > div {
    margin-top: 0;
    line-height: 24px;
    padding: 20px 50px;
    font-size: 18px;
  }
  & .leftEnd {
    border-radius: 10px 0px 0px 0px;
  }

  & .rightEnd {
    border-radius: 0px 10px 0px 0px;
  }
  @media screen and (min-width: 1150px) {
    display: none;
  }
`;

const NoEventDivStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 50%;

  & > div {
    font-weight: bold;
    line-height: 30px;
    /* text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap; */
  }

  /* @media screen and (max-width: 1150px) {
    width: 100%;
  } */
`;
