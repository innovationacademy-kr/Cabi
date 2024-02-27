import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IDate } from "@/pages/Wednesday/DetailPage";
import {
  TAdminModalState,
  WhiteSpaceTrStyled,
  itemType,
} from "@/components/Wednesday/Details/DetailTable";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";
import { IPresentationScheduleDetailInfo } from "@/types/dto/wednesday.dto";

const DetailTableBody = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  itemDate,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IPresentationScheduleDetailInfo;
  itemStatus: itemType;
  itemDate: IDate | null;
}) => {
  const [clickedItem, setClickedItem] =
    useState<null | IPresentationScheduleDetailInfo>(null);
  const navigator = useNavigate();

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

  return (
    <>
      <TableTrStyled
        itemStatus={itemStatus}
        id={clickedItem?.dateTime === item.dateTime ? "selected" : ""}
        onClick={() => {
          isAdmin && openAdminModal("statusModal");
          !itemStatus && handleItemClick(item);
        }}
        open={clickedItem?.dateTime === item.dateTime}
      >
        <td className="leftEnd" id={itemStatus}>
          <div>
            {itemDate?.month}월 {itemDate?.day}일
          </div>
        </td>
        {itemStatus ? (
          <>
            <td id={itemStatus} className="rightEnd" colSpan={4}>
              <NoEventDivStyled>
                {itemStatus === itemType.NO_EVENT_PAST ? (
                  <>
                    <div>발표가 없었습니다</div>
                    <SadCcabiStyled>
                      <SadCcabiImg />
                    </SadCcabiStyled>
                  </>
                ) : (
                  <>
                    <NoEventPhraseStyled>
                      <div>
                        다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를
                        신청해보세요
                      </div>
                      <img src="/src/assets/images/happyCcabi.svg" />
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
            <td>
              <div>{item.subject}</div>
            </td>
            <td>
              <div>{item.userName}</div>
            </td>
            <td>
              <div>{presentationCategoryKorean[item.category!]}</div>
            </td>
            <td className="rightEnd">
              <div>{presentationPeriodNumber[item.period!]}분</div>
            </td>
          </>
        )}
      </TableTrStyled>
      {clickedItem?.dateTime === item.dateTime ? (
        <>
          <TableDetailTrStyled>
            <td colSpan={5}>
              <div>
                "아니 내가 찍는 사진들 항상 왜 이렇게 나오는 건데?" 장비 탓인가
                싶어서 최신 스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒
                취미로 시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간
                사진 강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기
                쉽게 알려드립니다! 😉 "아니 내가 찍는 사진들 항상 왜 이렇게
                나오는 건데?" 장비 탓인가 싶어서 최신 스마트폰으로 바꿔 봤지만
                크게 달라지지 않은 결과물😒 취미로 시작하고 싶은데 도대체 뭐가
                뭔지 모르겠는 사진! 2년 간 사진 강의만 빡시게 해온 jisokang이
                엑기스만 쫙쫙 뽑아서 알기 쉽게 알려드립니다! 😉 "아니 내가 찍는
                사진들 항상 왜 이렇게 나오는 건데?" 장비 탓인가 싶어서 최신
                스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒 취미로
                시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간 사진
                강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게
                알려드립니다! 😉 왜 이렇게 나오는 건데?" 장비 탓인가 싶어서 최신
                스마트폰으로 바꿔 봤지만 크게 달라지지 않은 결과물😒 취미로
                시작하고 싶은데 도대체 뭐가 뭔지 모르겠는 사진! 2년 간 사진
                강의만 빡시게 해온 jisokang이 엑기스만 쫙쫙 뽑아서 알기 쉽게
                알려드립니다! 😉 건데?" 장비 탓인가 싶어서 최신 스마트폰으로
                바꿔 봤지만 크게 달라지지
              </div>
            </td>
          </TableDetailTrStyled>
        </>
      ) : null}
      <WhiteSpaceTrStyled />
      <TableMobileStyled
        // itemStatus={itemStatus}
        id={clickedItem?.dateTime === item.dateTime ? "selected" : ""}
        onClick={() => {
          isAdmin && openAdminModal("statusModal");
          !itemStatus && handleItemClick(item);
        }}
      >
        {itemStatus ? (
          <>
            {/* <td id={itemStatus} className="rightEnd" colSpan={4}> */}
            <div>없음</div>
            {/* </td> */}
          </>
        ) : (
          <>먼가 신청됨</>
        )}
      </TableMobileStyled>
    </>
  );
};

export default DetailTableBody;

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
  /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */

  & > td {
    padding: 0 10px;
  }

  & #noEventCurrent {
    background-color: white;
  }

  & #noEventPast {
    background-color: #eeeeee;
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
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FA")};
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NoEventDivStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
  /* justify-content: center; */
  align-items: center;
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  /* background-color: yellow; */

  & > img {
    width: 30px;
    height: 30px;
    margin-left: 10px;
  }

  & > div {
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const SadCcabiStyled = styled.div`
  width: 30px;
  height: 30px;
  display: flex;

  & svg {
    background-color: pink;
  }

  & svg > path {
    fill: var(--black);
  }
`;

const TableDetailTrStyled = styled.tr`
  background-color: #91b5fa;
  width: 100%;
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
`;

const TableMobileStyled = styled.div`
  @media screen and (min-width: 768px) {
    display: none;
  }
`;
