import { BanDto } from "@/types/dto/lent.dto";
import { useState } from "react";
import styled from "styled-components";
import Pagination from "../AdminChart/Pagination";

const BanTable = ({
  data,
  clickDetail,
}: {
  data: BanDto[];
  clickDetail: React.MouseEventHandler;
}) => {
  const [curPage, setCurPage] = useState(0);

  return (
    <TableWrapperstyled>
      <TableStyled>
        <colgroup>
          <col width="15%" />
          <col width="15%" />
          <col width="70%" />
        </colgroup>
        <TheadStyled>
          <tr>
            <th>층</th>
            <th>번호</th>
            <th>사유</th>
          </tr>
        </TheadStyled>
        <TbodyStyled>
          {data
            .slice(curPage * 10 + 0, curPage * 10 + 10)
            .map(({ floor, section, cabinet_num }, idx) => (
              <tr key={idx} onClick={clickDetail}>
                <td title={`${floor}층`}>{`${floor}층`}</td>
                <td title={cabinet_num.toString()}>{cabinet_num}</td>
                <td title={section || ""}>{section}</td>
              </tr>
            ))}
        </TbodyStyled>
      </TableStyled>
      {data.length > 0 && (
        <Pagination
          setCurPage={setCurPage}
          curPage={curPage}
          totalCount={data.length}
        ></Pagination>
      )}
      {data.length === 0 && (
        <EmptyStyled>사용 불가인 사물함이 없습니다.</EmptyStyled>
      )}
    </TableWrapperstyled>
  );
};

const TableWrapperstyled = styled.div`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background: var(--white);
`;

const TableStyled = styled.table`
  width: 100%;
  background: var(--white);
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

const EmptyStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  padding: 20px 0;
`;

export default BanTable;
