import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  IItem,
  TAdminModalState,
  WhiteSpaceTrStyled,
  itemType,
} from "@/components/Wednesday/Detail/DetailTable";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

const DetailTableBody = ({
  isAdmin,
  openAdminModal,
  item,
  itemStatus,
  id,
}: {
  isAdmin: boolean;
  openAdminModal: (modal: TAdminModalState) => void;
  item: IItem;
  itemStatus: itemType;
  id: number;
}) => {
  const [clickedItem, setClickedItem] = useState<null | IItem>(null);
  const navigator = useNavigate();

  const handleItemClick = (item: IItem) => {
    if (clickedItem?.date === item.date) setClickedItem(null);
    else setClickedItem(item);
  };

  useEffect(() => {
    console.log(clickedItem?.date === item.date);
  }, [clickedItem?.date, item.date]);
  return (
    <>
      <TableTrStyled
        itemStatus={itemStatus}
        id={clickedItem?.date === item.date ? "selected" : ""}
        onClick={() => {
          isAdmin && openAdminModal("statusModal");
          !itemStatus && handleItemClick(item);
        }}
        testt={clickedItem?.date === item.date}
      >
        <td className="leftEnd" id={itemStatus}>
          <span>{item.date}</span>
        </td>
        {itemStatus ? (
          <>
            <td id={itemStatus} className="rightEnd" colSpan={4}>
              <div>
                {itemStatus === itemType.NO_EVENT_PAST ? (
                  <>
                    <span>발표가 없었습니다</span>
                    <SadCcabiStyled>
                      <SadCcabiImg />
                    </SadCcabiStyled>
                  </>
                ) : (
                  <>
                    <NoEventPhraseStyled>
                      <span>
                        다양한 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를
                        신청해보세요
                      </span>
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
              </div>
            </td>
          </>
        ) : (
          <>
            <td>
              <span>{item.title}</span>
            </td>
            <td>
              <span>{item.intraId}</span>
            </td>
            <td>
              <span>{item.category}</span>
            </td>
            <td className="rightEnd">
              <span>{item.time}분</span>
            </td>
          </>
        )}
      </TableTrStyled>
      {clickedItem?.date === item.date ? null : <WhiteSpaceTrStyled />}
      {clickedItem?.date === item.date ? (
        <>
          <TableDetailTrStyled id="test">
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
          <WhiteSpaceTrStyled />
        </>
      ) : null}
    </>
  );
};

export default DetailTableBody;

const TableTrStyled = styled.tr<{
  itemStatus: itemType;
  testt?: boolean;
}>`
  height: 70px;
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-size: 18px;
  background-color: #dce7fd;

  & > td {
    padding: 0 10px;
    /* white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden; */
  }

  & #noEventCurrent {
    background-color: white;
  }

  & #noEventPast {
    background-color: #eeeeee;
  }

  & > td > div {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  & button {
    width: 120px;
    height: 36px;
    background-color: #3f69fd;
    font-weight: bold;
    font-size: 1rem;
  }

  & .leftEnd {
    border-radius: ${(props) => (props.testt ? "10px 0 0 0" : "10px 0 0 10px")};
  }

  & .rightEnd {
    border-radius: ${(props) => (props.testt ? "0 10px 0 0" : "0 10px 10px 0")};
  }

  &:hover {
    cursor: ${(props) => (props.itemStatus ? "" : "pointer")};
    background-color: ${(props) => (props.itemStatus ? "" : "#91B5FA")};
  }
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  align-items: center;
  width: 600px;

  & > img {
    width: 30px;
    height: 30px;
    margin-left: 10px;
  }

  & > span {
    font-weight: bold;
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
    height: 200px;
    border-radius: 10px;
    margin: 24px;
    margin-top: 0;
    line-height: 24px;
    padding: 20px 50px;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
