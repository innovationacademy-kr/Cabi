import styled from "styled-components";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import {
  PresentationLocationLabelMap,
  PresentationStatusTypeLabelMap,
} from "@/assets/data/Presentation/maps";
import { PresentationHistoryResponseType } from "@/types/dto/presentation.dto";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
};

const LogTable = ({
  presentationHistory,
}: {
  presentationHistory: PresentationHistoryResponseType;
}) => {
  if (presentationHistory === undefined) return <LoadingAnimation />;

  return (
    <LogTableWrapperstyled>
      <LogTableStyled>
        <TheadStyled>
          <tr>
            <th>날짜</th>
            <th>제목</th>
            <th>장소</th>
            <th>상태</th>
          </tr>
        </TheadStyled>
        {presentationHistory !== STATUS_400_BAD_REQUEST && (
          <TbodyStyled>
            {presentationHistory.map(
              (
                { dateTime, subject, presentationLocation, presentationStatus },
                idx
              ) => (
                <tr key={idx}>
                  <td title={new Date(dateTime).toLocaleString("ko-KR")}>
                    {new Date(dateTime).toLocaleString("ko-KR", dateOptions)}
                  </td>
                  <td title={subject}>{subject}</td>
                  <td title={presentationLocation}>
                    {PresentationLocationLabelMap[presentationLocation]}
                  </td>
                  <td title={presentationStatus}>
                    {PresentationStatusTypeLabelMap[presentationStatus]}
                  </td>
                </tr>
              )
            )}
          </TbodyStyled>
        )}
      </LogTableStyled>
      {presentationHistory === STATUS_400_BAD_REQUEST ||
        (presentationHistory.length === 0 && (
          <EmptyLogStyled>발표기록이 없습니다.</EmptyLogStyled>
        ))}
    </LogTableWrapperstyled>
  );
};

const LogTableWrapperstyled = styled.div`
  width: 100%;
  max-width: 900px;
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
    padding-left: 0px;
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
    line-height: 20px;
    padding-top: 15px;
    width: 25%;
    padding-bottom: 10px;
  }
  & > tr:nth-child(2n) {
    background-color: hsl(228, 100%, 98%);
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
