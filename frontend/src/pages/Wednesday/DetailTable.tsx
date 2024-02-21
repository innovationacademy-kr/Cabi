import styled from "styled-components";
import { ReactComponent as SadCcabiImg } from "@/assets/images/sadCcabi.svg";

const DetailTable = () => {
  // const tableHeadArray = [
  //   { date: "날짜" },
  //   { intraId: "ID" },
  //   { title: "제목" },
  //   { time: "시간" },
  //   { category: "카테고리" },
  // ];

  // console.log(Object.entries(tableHeadArray));
  return (
    <TableStyled>
      <TableHeadStyled>
        {/* {tableHeadArray.map((head, idx) => {
          return <th id={head[idx]}>날짜</th>;
        })} */}
        <th id="date">날짜</th>
        <th id="intraId">ID</th>
        <th id="title">제목</th>
        <th id="time">시간</th>
        <th id="category">카테고리</th>
      </TableHeadStyled>
      <TableBodyStyled>
        <td className="leftEnd">
          <span>1월 13일</span>
        </td>
        <td>
          <span>aaaaaaaaaa</span>
        </td>
        <td>
          <span>사진을 위한 넓고 얕은 지식눌렀을때는 제목이 모두 보이게</span>
        </td>
        <td>
          <span>30분</span>
        </td>
        <td className="rightEnd">
          <span>취미</span>
        </td>
      </TableBodyStyled>
      <TableBodyStyled>
        <td className="leftEnd" id="noEventCurrent">
          <span>1월 20일</span>
        </td>
        <td className="rightEnd" colSpan={4} id="noEventCurrent">
          <div>
            <NoEventPhraseStyled>
              <span>
                다양한 주제와 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를
                신청해보세요
              </span>
              <img src="/src/assets/images/happyCcabi.svg" />
            </NoEventPhraseStyled>
            <button>신청하기</button>
          </div>
        </td>
      </TableBodyStyled>
      {/* <TableBodyStyled>
        <td className="leftEnd" id="noEventPast">
          <span>1월 20일</span>
        </td>
        <td className="rightEnd" colSpan={4} id="noEventPast">
          <div>
            <NoEventPhraseStyled>
              <span>발표가 없었습니다</span>
              <SadCcabiStyled>
                <SadCcabiImg />
              </SadCcabiStyled>
            </NoEventPhraseStyled>
          </div>
        </td>
      </TableBodyStyled> */}
    </TableStyled>
  );
};

export default DetailTable;

const TableStyled = styled.table`
  width: 100%;
  border-spacing: 0 24px;
  border-collapse: separate;
`;

const TableHeadStyled = styled.tr`
  height: 50px;
  line-height: 50px;
  background-color: #3f69fd;
  color: var(--white);

  & > th {
    font-size: 20px;
    /* border-radius: 10px; */
  }

  & > #date {
    width: 170px;
    border-radius: 10px 0 0 10px;
  }

  & > #intraId {
    width: 180px;
  }

  & > #title {
    width: 740px;
  }

  & > #time {
    width: 100px;
  }

  & > #category {
    width: 120px;
    border-radius: 0 10px 10px 0;
  }
`;

const TableBodyStyled = styled.tr`
  height: 100px;
  width: 100%;
  line-height: 100px;
  text-align: center;
  font-size: 20px;

  & > td {
    background-color: #dce7fd;
  }

  & #noEventCurrent {
    background-color: white;
  }

  & #noEventPast {
    background-color: #eeeeee;
  }

  & > td > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  & button {
    width: 120px;
    height: 40px;
    margin-left: 100px;
    margin-right: 60px;
    background-color: #3f69fd;
    font-weight: bold;
  }

  & .leftEnd {
    border-radius: 10px 0 0 10px;
  }

  & .rightEnd {
    border-radius: 0 10px 10px 0;
  }
`;

const NoEventPhraseStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 850px;

  & > img {
    width: 30px;
    height: 30px;
    margin-left: 20px;
  }

  & > span {
    font-weight: bold;
  }
`;

const SadCcabiStyled = styled.div`
  width: 30px;
  height: 30px;
  background-color: yellow;
  display: flex;

  & svg {
    background-color: pink;
  }

  & svg > path {
    fill: var(--black);
  }
`;
