import { useEffect, useState } from "react";
import styled from "styled-components";
import ClubLogTable from "@/components/Club/ClubLogTable";
import { ClubUserDto } from "@/types/dto/lent.dto";
import { ClubLogResponseType } from "@/types/dto/lent.dto";
import { axiosGetClubUserLog } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";
import ClubModal, { ClubModalInterface } from "@/components/Modals/ClubModal/ClubModal";
import Button from "@/components/Common/Button";

const initialClubValue:ClubModalInterface = {
  clubName: "",
};

const AdminClubPage = () => {
  const [clubLog, setLentLog] = useState<ClubLogResponseType>(undefined);
  const [clubModalType, setClubModalType] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState<ClubModalInterface>(initialClubValue);

  useEffect(() => {
    getLentLog();
  }, []);

  const handleOpenModal = (type: string, club: ClubModalInterface) => {
    setClubModalType(type);
    setSelectedClub(club);
  };  

  const handleCloseModal = () => {
    setClubModalType(null);
    setSelectedClub(initialClubValue);
  };

  const getLentLog = async () => {
    try {
      const response = await axiosGetClubUserLog(0);
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

  const clubModalObj = selectedClub;

  return (
    <WrapperStyled>
      <TitleStyled>동아리 목록</TitleStyled>
      <SubTitleStyled>
        현재 등록된 동아리 목록을 확인할 수 있습니다.
      </SubTitleStyled>
      <ClubLogTable ClubList={clubLog} />
      <ButtonWrapperStyled>
        <Button
          onClick={() => handleOpenModal("CREATE", initialClubValue)}
          text={"동아리 생성"}
          theme="line"
        />
        <Button
          onClick={() => handleOpenModal("DELETE", selectedClub)}
          text={"삭제"}
          theme="fill"
        />
      </ButtonWrapperStyled>
      {clubModalType && (
        <ClubModal
        clubModalObj={selectedClub}
        type={clubModalType}
        onClose={handleCloseModal}
      />
      )}
    </WrapperStyled>
  );
};

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: normal;
  margin-top: 30px;
`;
const WrapperStyled = styled.div`
  /* display: flex; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 70px;
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
