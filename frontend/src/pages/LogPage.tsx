import LogTable from "@/components/LentLog/LogTable/LogTable";
import styled from "styled-components";
import { axiosMyLentLog } from "@/api/axios/axios.custom";
import { useEffect, useState } from "react";
import { LentLogDto } from "@/types/dto/lent.dto";
import useMenu from "@/hooks/useMenu";

const LogPage = () => {
  const [lentLog, setLentLog] = useState<LentLogDto[] | undefined>(undefined);
  const { toggleLent } = useMenu();

  useEffect(() => {
    const getLentLog = async () => {
      try {
        const response = await axiosMyLentLog(1);
        const lentLogArray: LentLogDto[] = response.data.result;
        setLentLog(lentLogArray);
      } catch (error) {
        console.log(error);
      }
    };
    getLentLog();
  }, []);

  return (
    <WrapperStyled>
      <TitleStyled onClick={() => toggleLent()}>사물함 대여 기록</TitleStyled>
      <SubTitleStyled>
        최근 10회의 대여 기록을 확인할 수 있습니다.
      </SubTitleStyled>
      <LogTable data={lentLog} />
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
  color: var(--lightpurple-color);
`;
export default LogPage;
