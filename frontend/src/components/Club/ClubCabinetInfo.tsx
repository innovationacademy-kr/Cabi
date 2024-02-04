import { useState } from "react";
import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import ClubDetail from "./ClubDetail";
import ClubMemo from "./ClubMemo";

const ClubCabinetInfo = ({ clubInfo }: { clubInfo: ClubInfoResponseDto }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [isModalOpenTest, setIsModalOpenTest] = useState<boolean>(false);

  // const [testModal, setTestModal] = useState<IModalContents>({
  //   type: "hasProceedBtn",
  //   title: "비밀번호 설정",
  //   closeModal: () => {
  //     closeModal();
  //   },
  // });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // const handleSettingLogoClick = () => {
  //   setIsModalOpenTest(true);
  // };

  return (
    <ClubCabinetInfoStyled>
      <ClubHeaderStyled>동아리 정보</ClubHeaderStyled>
      <ClubInfoBoxStyled>
        <ClubDetail clubInfo={clubInfo} />
        <ClubMemo
          openModal={openModal}
          closeModal={closeModal}
          isModalOpen={isModalOpen}
        />
      </ClubInfoBoxStyled>
    </ClubCabinetInfoStyled>
  );
};

const ClubCabinetInfoStyled = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 60px;
`;

const ClubHeaderStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
  font-size: 20px;
  font-weight: bold;
`;

const ClubInfoBoxStyled = styled.div`
  width: 795px;
  height: 285px;
  display: flex;
  justify-content: space-between;
  margin: 20px;
`;

export default ClubCabinetInfo;
