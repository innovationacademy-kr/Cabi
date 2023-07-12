import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubLogTable from "@/components/Club/ClubLogTable";
import { ClubUserDto } from "@/types/dto/lent.dto";
import { ClubLogResponseType } from "@/types/dto/lent.dto";
import { axiosClubUserLog } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const AdminClubPage = () => {
  const [clubLog, setLentLog] = useState<ClubLogResponseType>(undefined);
  const getLentLog = async () => {
    try {
      const response = await axiosClubUserLog(0);
      const clubListLogs: ClubUserDto[] = response.data.result;
      setTimeout(() => {
        setLentLog(clubListLogs);
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
      <TitleStyled>동아리 목록</TitleStyled>
      <SubTitleStyled>
        현재 등록된 동아리 목록을 확인할 수 있습니다.
      </SubTitleStyled>
      <ClubLogTable ClubList={clubLog} />
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
export default AdminClubPage;
