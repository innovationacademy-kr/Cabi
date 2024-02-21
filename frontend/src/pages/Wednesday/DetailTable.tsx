import styled from "styled-components";

// 170px

const DetailTable = () => {
  return (
    <TableStyled>
      <TableHeadStyled>
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
        <td className="leftEnd" id="noEvent">
          <span>1월 20일</span>
        </td>
        <td className="rightEnd" colSpan={4} id="noEvent">
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
  height: 60px;
  line-height: 60px;

  & > th {
    font-size: 20px;
  }

  & > #date {
    width: 170px;
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
  }
`;

const TableBodyStyled = styled.tr`
  height: 100px;
  width: 100%;
  line-height: 100px;
  text-align: center;
  font-size: 20px;

  & > td {
    background-color: #f5f7ff;
  }

  & #noEvent {
    background-color: white;
  }

  & > td > div {
    /* background-color: green; */

    display: flex;
    justify-content: center;
    align-items: center;
  }

  & button {
    width: 120px;
    height: 40px;
    margin-left: 100px;
    margin-right: 60px;
  }

  & .leftEnd {
    border-radius: 10px 0 0 10px;
  }
  & .rightEnd {
    border-radius: 0 10px 10px 0;
  }
`;

const NoEventPhraseStyled = styled.div`
  /* background-color: yellow; */
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
