import { BanDto } from "@/types/dto/lent.dto";
import { useState } from "react";
import styled from "styled-components";
import Pagination from "./Pagination";

const ROW_COUNT = 5;

interface IData {
  first?: string;
  second?: string;
  third?: string;
}
const AdminTable = ({
  data,
  handleClick,
  thInfo,
  ratio,
}: {
  data: IData[];
  handleClick: React.MouseEventHandler;
  thInfo: string[];
  ratio: string[];
}) => {
  const [curPage, setCurPage] = useState(0);
  return (
    <TableWrapperstyled>
      <Pagination
        setCurPage={setCurPage}
        curPage={curPage}
        totalCount={data.length}
        rowCount={ROW_COUNT}
      ></Pagination>
      <TableBorderStyled>
        <TableStyled>
          <colgroup>
            <col width={ratio[0]} />
            <col width={ratio[1]} />
            <col width={ratio[2]} />
          </colgroup>
          <TheadStyled>
            <tr>
              <th>{thInfo[0]}</th>
              <th>{thInfo[1]}</th>
              <th>{thInfo[2]}</th>
            </tr>
          </TheadStyled>

          <TbodyStyled>
            {new Array(ROW_COUNT).fill(0).map((_, idx) => {
              const curIndex = ROW_COUNT * curPage + idx;
              return (
                <tr key={idx}>
                  <td title={thInfo[0]}>
                    {curIndex < data.length ? data[curIndex].first : ""}
                  </td>
                  <td title={thInfo[1]}>
                    {curIndex < data.length ? data[curIndex].second : ""}
                  </td>
                  <td title={thInfo[2]}>
                    {curIndex < data.length ? data[curIndex].third : ""}
                  </td>
                </tr>
              );
            })}
          </TbodyStyled>
        </TableStyled>
      </TableBorderStyled>
    </TableWrapperstyled>
  );
};

const TableWrapperstyled = styled.div`
  width: 80%;
  height: 100%;
  margin: 0 auto;
  background: var(--white);
`;

const TableBorderStyled = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 25px -6px var(--bg-shadow);
`;

const TableStyled = styled.table`
  width: 100%;
  background: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  overflow: scroll;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: var(--main-color);
  color: var(--white);
`;

const TbodyStyled = styled.tbody`
  & > tr {
    text-align: center;
    height: 45px;
  }
  & > tr > td {
    height: 45px;
    line-height: 45px;
  }
  & > tr:nth-child(2n) {
    background: #f9f6ff;
  }
  cursor: pointer;
`;

export default AdminTable;
