import styled from "styled-components";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { LentLogResponseType } from "@/types/dto/lent.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
};

const LogTable = ({ lentHistory }: { lentHistory: LentLogResponseType }) => {
  if (lentHistory === undefined) return <LoadingAnimation />;

  return (
    <LogTableWrapperstyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>위치</th>
            <th>대여일</th>
            <th>반납일</th>
          </tr>
        </TheadStyled>
        {lentHistory !== STATUS_400_BAD_REQUEST && (
          <TbodyStyled>
            {lentHistory.map(
              ({ floor, section, visibleNum, startedAt, endedAt }, idx) => (
                <tr key={idx}>
                  <td
                    title={`${floor}층 ${section}`}
                  >{`${floor}F - ${visibleNum}번`}</td>
                  <td title={new Date(startedAt).toLocaleString("ko-KR")}>
                    {new Date(startedAt).toLocaleString("ko-KR", dateOptions)}
                  </td>
                  <td
                    title={
                      endedAt ? new Date(endedAt).toLocaleString("ko-KR") : "-"
                    }
                  >
                    {endedAt
                      ? new Date(endedAt).toLocaleString("ko-KR", dateOptions)
                      : "-"}
                  </td>
                </tr>
              )
            )}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {lentHistory === STATUS_400_BAD_REQUEST ||
        (lentHistory.length === 0 && (
          <EmptyLogStyled>대여기록이 없습니다.</EmptyLogStyled>
        ))}
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
    background: #f9f6ff;
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

export default LogTable;
