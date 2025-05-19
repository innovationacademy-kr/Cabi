import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import LogTable from "@/Presentation_legacy/components/PresentationLog/LogTable";
import {
  PresentationHistoryDto,
  PresentationHistoryResponseType,
} from "@/Presentation_legacy/types/dto/presentation.dto";
import { axiosMyPresentationLog } from "@/Presentation_legacy/api/axios/axios.custom";

const PresentationLogPage = () => {
  const [presentationLog, setPresentationLog] =
    useState<PresentationHistoryResponseType>(undefined);

  const getPresentationLog = async () => {
    try {
      const response = await axiosMyPresentationLog(0);
      const presentationLogs: PresentationHistoryDto[] = response.data.result;
      setTimeout(() => {
        setPresentationLog(presentationLogs);
      }, 500);
    } catch {
      setTimeout(() => {
        setPresentationLog(HttpStatusCode.BadRequest);
      }, 500);
    }
  };

  useEffect(() => {
    getPresentationLog();
  }, []);

  return (
    <WrapperStyled>
      <TitleStyled>나의 발표 기록</TitleStyled>
      <SubTitleStyled>
        최근 10회의 발표 기록을 확인할 수 있습니다.
      </SubTitleStyled>
      <LogTable presentationHistory={presentationLog} />
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

export default PresentationLogPage;
