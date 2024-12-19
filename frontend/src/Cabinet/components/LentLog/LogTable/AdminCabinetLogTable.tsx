import { HttpStatusCode } from "axios";
import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { LentLogResponseType } from "@/Cabinet/types/dto/lent.dto";
import { formatDate } from "@/Cabinet/utils/dateUtils";

const AdminCabinetLogTable = ({
  lentLog,
}: {
  lentLog: LentLogResponseType;
}) => {
  if (lentLog === undefined) return <LoadingAnimation />;

  return (
    <LogTableWrapperstyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>인트라 ID</th>
            <th>대여일</th>
            <th>반납일</th>
          </tr>
        </TheadStyled>
        {lentLog !== HttpStatusCode.BadRequest && (
          <TbodyStyled>
            {lentLog.map(
              ({ floor, section, name, startedAt, endedAt }, idx) => (
                <tr key={idx}>
                  <td title={`${floor}층 ${section}`}>{name}</td>
                  <td title={new Date(startedAt).toLocaleString("ko-KR")}>
                    {formatDate(new Date(startedAt), ".", 2, 2, 2)}
                  </td>
                  <td
                    title={
                      endedAt ? new Date(endedAt).toLocaleString("ko-KR") : "-"
                    }
                  >
                    {endedAt
                      ? formatDate(new Date(endedAt), ".", 2, 2, 2)
                      : "-"}
                  </td>
                </tr>
              )
            )}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {(lentLog === HttpStatusCode.BadRequest || lentLog.length === 0) && (
        <EmptyLogStyled>대여기록이 없습니다.</EmptyLogStyled>
      )}
    </LogTableWrapperstyled>
  );
};

const LogTableWrapperstyled = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px 0 var(--table-border-shadow-color-100);
`;

const LogTableStyled = styled.table`
  width: 100%;
  background: var(--bg-color);
  overflow: scroll;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: var(--sys-main-color);
  color: var(--white-text-with-bg-color);
  & > tr > th:first-child {
    padding-left: 20px;
  }
  & > tr > th:last-child {
    padding-right: 20px;
  }
`;

const TbodyStyled = styled.tbody`
  & > tr {
    font-size: small;
    text-align: center;
    height: 50px;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
    width: 33.3%;
  }
  & > tr:nth-child(2n) {
    background: var(--table-even-row-bg-color);
  }
  & > tr > td:first-child {
    padding-left: 20px;
  }
  & > tr > td:last-child {
    padding-right: 20px;
  }
`;

const EmptyLogStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  padding: 20px 0;
`;

export default AdminCabinetLogTable;
 