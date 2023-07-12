import styled from "styled-components";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { LentLogResponseType } from "@/types/dto/lent.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
};

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
        {lentLog !== STATUS_400_BAD_REQUEST && (
          <TbodyStyled>
            {lentLog.map(
              ({ floor, section, name, startedAt, endedAt }, idx) => (
                <tr key={idx}>
                  <td title={`${floor}층 ${section}`}>{name}</td>
                  <td title={new Date(startedAt).toLocaleString("ko-KR")}>
                    {new Date(startedAt).toLocaleString("ko-KR", dateOptions)}
                  </td>
                  <td title={new Date(endedAt).toLocaleString("ko-KR")}>
                    {new Date(endedAt).toLocaleString("ko-KR", dateOptions)}
                  </td>
                </tr>
              )
            )}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {(lentLog === STATUS_400_BAD_REQUEST || lentLog.length === 0) && (
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
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const LogTableStyled = styled.table`
  width: 100%;
  background: var(--white);
  overflow: scroll;
`;

const TheadStyled = styled.thead`
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: var(--main-color);
  color: var(--white);
`;

const TbodyStyled = styled.tbody`
  & > tr {
    //font-size: 11px;
    text-align: center;
    height: 50px;
  }
  & > tr > td {
    height: 50px;
    line-height: 50px;
    //padding: 0 22px;
    width: 33.3%;
  }
  & > tr:nth-child(2n) {
    background: #f9f6ff;
  }
`;

const EmptyLogStyled = styled.div`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  padding: 20px 0;
`;

export default AdminCabinetLogTable;
