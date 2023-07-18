import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedClubInfoState } from "@/recoil/atoms";
import AdminClubLogContainer from "@/components/Club/AdminClubLog.container";
import Button from "@/components/Common/Button";
import ClubModal from "@/components/Modals/ClubModal/ClubModal";
import { ClubUserDto } from "@/types/dto/lent.dto";
import { ClubLogResponseType } from "@/types/dto/lent.dto";
import { axiosGetClubUserLog } from "@/api/axios/axios.custom";
import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

const AdminClubPage = () => {
  const [clubLog, setClubLog] = useState<ClubLogResponseType>(undefined);
  const [logChanged, setLogChanged] = useState(true);
  const [clubModalType, setClubModalType] = useState<string | null>(null);
  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(
    selectedClubInfoState
  );

  useEffect(() => {
    if (logChanged) {
      getLentLog();
      setLogChanged(false);
    }
  }, [logChanged]);

  const handleOpenModal = (type: string, club: ClubUserDto | null) => {
    setClubModalType(type);
    setSelectedClubInfo(club);
  };

  const handleCloseModal = () => {
    setClubModalType(null);
    setSelectedClubInfo(null);
  };

  const handleLogChanged = () => {
    setLogChanged(true);
  };

  const getLentLog = async () => {
    try {
      const response = await axiosGetClubUserLog(0);
      const clubListLogs: ClubUserDto[] = response.data.result;
      setTimeout(() => {
        setClubLog(clubListLogs);
      }, 500);
    } catch {
      setTimeout(() => {
        setClubLog(STATUS_400_BAD_REQUEST);
      }, 500);
    }
  };

  return (
    <WrapperStyled>
      <TitleStyled>동아리 목록</TitleStyled>
      <SubTitleStyled>
        현재 등록된 동아리 목록을 확인할 수 있습니다.
      </SubTitleStyled>
      <AdminClubLogContainer />
      <ButtonWrapperStyled>
        <Button
          text={"동아리 생성"}
          onClick={() => handleOpenModal("CREATE", null)}
          theme="line"
        />
        <Button
          text={"삭제"}
          onClick={() => handleOpenModal("DELETE", selectedClubInfo)}
          theme={!selectedClubInfo ? "lightGrayLine" : "fill"}
          disabled={!selectedClubInfo}
        />
      </ButtonWrapperStyled>
      {clubModalType && (
        <ClubModal
          type={clubModalType}
          onClose={handleCloseModal}
          onReload={handleLogChanged}
        />
      )}
    </WrapperStyled>
  );
};

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* align-items: center; */
  margin-top: 30px;
  gap: 30px;
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
