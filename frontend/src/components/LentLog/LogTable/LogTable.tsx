import styled from "styled-components";

interface ILogData {
  loc: string;
  lent_begin: string;
  lent_end: string;
}

const LogTable = ({ data }: { data: ILogData[] }) => {
  return (
    <LogTableStyled>
      <TheadStyled>
        <tr>
          <th>위치</th>
          <th>대여일</th>
          <th>반납일</th>
        </tr>
      </TheadStyled>
      <TbodyStyled>
        {data.map(({ loc, lent_begin, lent_end }, idx) => (
          <tr key={idx}>
            <td>{loc}</td>
            <td>{lent_begin}</td>
            <td>{lent_end}</td>
          </tr>
        ))}
      </TbodyStyled>
    </LogTableStyled>
  );
};

const LogTableStyled = styled.table`
  width: 90%;
  background: var(--white);
  margin: 0 auto;
  margin-top: 50px;
  overflow: scroll;
`;

const TbodyStyled = styled.tbody`
  & > tr {
    text-align: center;
    height: 50px;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
  }
  & > tr:nth-child(2n) {
    background: #eeeeee;
    border-bottom: 1px soild #999999;
  }
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: var(--main-color);
  color: var(--white);
`;

export default LogTable;
