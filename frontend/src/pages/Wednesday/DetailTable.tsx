import styled from "styled-components";

const DetailTable = () => {
  return (
    <TableStyled>
      <TableHeadStyled>
        <th>날짜</th>
        <th>ID</th>
        <th>제목</th>
        <th>시간</th>
        <th>카테고리</th>
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
          <span>
            다양한 주제와 관심사를 함께 나누고 싶으신 분은 지금 바로 발표를
            신청해보세요
          </span>
          <img src="/src/assets/images/happyCcabi.svg" />
          <button>신청하기</button>
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

  & > #noEvent {
    background-color: white;
    /* display: flex;
    align-items: center;
    justify-content: center; */
  }
`;

const TableHeadStyled = styled.tr`
  height: 60px;
  line-height: 60px;

  & > th {
    font-size: 20px;
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

  & button {
    width: 120px;
    height: 40px;
  }
  & img {
    width: 30px;
    height: 30px;
    margin-left: 20px;
  }
  & .leftEnd {
    border-radius: 10px 0 0 10px;
  }
  & .rightEnd {
    border-radius: 0 10px 10px 0;
  }
`;
