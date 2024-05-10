import { useEffect, useState } from "react";
import styled from "styled-components";
import LogTable from "@/Cabinet/components/LentLog/LogTable/LogTable";
import { LentHistoryDto } from "@/Cabinet/types/dto/lent.dto";
import { LentLogResponseType } from "@/Cabinet/types/dto/lent.dto";
import { axiosMyLentLog } from "@/Cabinet/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/Cabinet/constants/StatusCode";

const LogPage = () => {
  const [lentLog, setLentLog] = useState<LentLogResponseType>(undefined);

  const getLentLog = async () => {
    try {
      const response = await axiosMyLentLog(0);
      const lentLogs: LentHistoryDto[] = response.data.result;
      setTimeout(() => {
        setLentLog(lentLogs);
      }, 500);
    } catch {
      setTimeout(() => {
        setLentLog(STATUS_400_BAD_REQUEST);
      }, 500);
    }
  };

  useEffect(() => {
    getLentLog();
  }, []);

  return (
    <WrapperStyled>
      <TitleStyled>사물함 대여 기록</TitleStyled>
      <SubTitleStyled>
        최근 10회의 대여 기록을 확인할 수 있습니다.
      </SubTitleStyled>
      <LogTable lentHistory={lentLog} />
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
  @media screen and (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const TitleStyled = styled.div`
  text-align: center;
  font-size: 2rem;
  letter-spacing: -0.02rem;
  font-weight: 700;
  margin-bottom: 30px;
`;

const SubTitleStyled = styled.div`
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: -0.02rem;
  margin-bottom: 25px;
  color: var(--sys-sub-color);
`;
export default LogPage;
