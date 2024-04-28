import { useState } from "react";
import styled from "styled-components";
import Pagination from "@/Cabinet/components/AdminInfo/Table/Pagination";
import { ITableData } from "@/Cabinet/types/dto/admin.dto";

const AdminTable = ({
  data,
  handleClick,
  thInfo,
  ratio,
  fontSize,
  ROW_COUNT,
}: {
  data: ITableData[];
  handleClick: React.MouseEventHandler;
  thInfo: string[];
  ratio: string[];
  fontSize?: string[];
  ROW_COUNT: number;
}) => {
  const [curPage, setCurPage] = useState(0);
  const emptyClick = () => {};
  return (
    <TableWrapperStyled>
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
                <tr
                  key={idx}
                  onClick={
                    curIndex < data.length && data[curIndex].first
                      ? handleClick
                      : emptyClick
                  }
                  data-info={data ? JSON.stringify(data[curIndex]?.info) : ""}
                  title={data ? data[curIndex]?.first : ""}
                >
                  <td style={{ fontSize: fontSize ? fontSize[0] : "0.9rem" }}>
                    {curIndex < data.length ? data[curIndex].first : ""}
                  </td>
                  <td style={{ fontSize: fontSize ? fontSize[1] : "0.9rem" }}>
                    {curIndex < data.length ? data[curIndex].second : ""}
                  </td>
                  <td style={{ fontSize: fontSize ? fontSize[2] : "0.9rem" }}>
                    {curIndex < data.length ? data[curIndex].third : ""}
                  </td>
                </tr>
              );
            })}
          </TbodyStyled>
        </TableStyled>
      </TableBorderStyled>
    </TableWrapperStyled>
  );
};

const TableWrapperStyled = styled.div`
  width: 80%;
  height: 100%;
  margin: 0 auto;
  background: var(--bg-color);
`;

const TableBorderStyled = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 10px 0px var(--table-border-shadow-color-200);
`;

const TableStyled = styled.table`
  width: 100%;
  background: var(--bg-color);
  overflow: scroll;

  @media screen and (max-width: 1300px) {
    min-height: 350px;
  }
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: var(--sys-main-color);
  color: var(--bg-color);
`;

const TbodyStyled = styled.tbody`
  & > tr {
    text-align: center;
    height: 47px;
  }
  & > tr > td {
    height: 47px;
    line-height: 45px;
  }
  & > tr:nth-child(2n) {
    background: var(--shared-purple-color-100);
  }
  cursor: pointer;

  @media screen and (max-width: 1300px) {
    & > tr > td {
      line-height: 60px;
      height: 61.5px;
    }
  }
`;

export default AdminTable;
