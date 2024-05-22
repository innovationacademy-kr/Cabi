import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedClubInfoState } from "@/Cabinet/recoil/atoms";
import AdminClubLogContainer from "@/Cabinet/components/Club/AdminClubLog.container";
import Button from "@/Cabinet/components/Common/Button";
import ClubModal from "@/Cabinet/components/Modals/ClubModal/ClubModal";
import { ClubUserDto } from "@/Cabinet/types/dto/lent.dto";
import { deleteRecoilPersistFloorSection } from "@/Cabinet/utils/recoilPersistUtils";

const AdminClubPage = () => {
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [clubModalType, setClubModalType] = useState<string | null>(null);
  const [selectedClubInfo, setSelectedClubInfo] = useRecoilState(
    selectedClubInfoState
  );

  useEffect(() => {
    deleteRecoilPersistFloorSection();
  }, []);

  const handleDataChanged = () => {
    setShouldFetchData(true);
  };

  const handleOpenModal = (type: string, club: ClubUserDto | null) => {
    setClubModalType(type);
    setSelectedClubInfo(club);
  };

  const handleCloseModal = () => {
    setClubModalType(null);
    setSelectedClubInfo(null);
  };

  return (
    <WrapperStyled>
      <TitleStyled>동아리 목록</TitleStyled>
      <SubTitleStyled>
        현재 등록된 동아리 목록을 확인할 수 있습니다.
      </SubTitleStyled>
      <AdminClubLogContainer
        shouldFetchData={shouldFetchData}
        setShouldFetchData={setShouldFetchData}
      />
      <ButtonWrapperStyled>
        <Button
          text={"동아리 생성"}
          onClick={() => handleOpenModal("CREATE", null)}
          theme="line"
        />
        <Button
          text={"수정"}
          onClick={() => handleOpenModal("EDIT", selectedClubInfo)}
          theme={!selectedClubInfo ? "grayLine" : "line"}
          disabled={!selectedClubInfo}
        />
        <Button
          text={"삭제"}
          onClick={() => handleOpenModal("DELETE", selectedClubInfo)}
          theme={!selectedClubInfo ? "grayLine" : "line"}
          disabled={!selectedClubInfo}
        />
      </ButtonWrapperStyled>
      {clubModalType && (
        <ClubModal
          type={clubModalType}
          onClose={handleCloseModal}
          onReload={handleDataChanged}
        />
      )}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
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
  margin-bottom: 5px;
  color: var(--sys-sub-color);
`;

const ButtonWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
  gap: 30px;
`;

export default AdminClubPage;
