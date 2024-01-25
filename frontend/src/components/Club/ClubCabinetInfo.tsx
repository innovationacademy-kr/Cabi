import { useState } from "react";
import styled from "styled-components";
import MemoModalTestContainer from "../Modals/ClubModal/MemoModalTest.container";
import MemoModalTest from "../Modals/ClubModal/MemoModalTest";
import SwapModal from "../Modals/SwapModal/SwapModal";

// import Modal from "/src/components/Modals/MemoModal/";

const ClubCabinetInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  let CabinetNumData = 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <ClubCabinetInfoStyled>
      <ClubHeader>동아리 사물함</ClubHeader>
      <ClubInfoBox>
        <ClubBasicInfoBox>
          {/* <CabinetNumInfo> */}
          <CabinetNum>{CabinetNumData}</CabinetNum>
          <CabinetSideInfo>
            <SideInfoClubName>cabi</SideInfoClubName>
            <SideInfoFloor>floor</SideInfoFloor>
            <SideInfoMember>
              <LeaderIcon>
                <img src="/src/assets/images/leader.svg"></img>
              </LeaderIcon>
              <UserId>jimchoi</UserId>
            </SideInfoMember>
          </CabinetSideInfo>
          <JustLine></JustLine>
          <ClubPw>
            비밀번호
            <Pw>****</Pw>
            <SettingLogo>
              {" "}
              <img src="/src/assets/images/setting.svg"></img>
            </SettingLogo>
          </ClubPw>
          {/* </CabinetNumInfo> */}
        </ClubBasicInfoBox>
        <ClubSubInfoBox>
          <ClubMemoHeader>
            동아리 메모
            <MemoIcon>
              <img src="/src/assets/images/more.svg" onClick={openModal}></img>
            </MemoIcon>
          </ClubMemoHeader>
          <ClubMemo>바보</ClubMemo>
          <TextCount>6/300</TextCount>
        </ClubSubInfoBox>
      </ClubInfoBox>
      <MemoModalTestContainer
        onClose={() => closeModal()}
        isModalOpen={isModalOpen}
      />
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
`;
const ClubHeader = styled.div`
  width: 800px;
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
`;
const ClubInfoBox = styled.div`
  width: 800px;
  height: 285px;
  display: flex;
  justify-content: space-around;
  margin: 20px;
`;
const ClubBasicInfoBox = styled.div`
  width: 350px;
  height: 285px;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  /* justify-content: start; */
  flex-wrap: wrap;
  /* align-items: center; */
`;
const ClubSubInfoBox = styled.div`
  width: 350px;
  height: 285px;
  /* flex-direction: column; */
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  /* justify-content: end; */
  flex-direction: column;
  /* flex-wrap: wrap; */
`;
const ClubMemoHeader = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ClubMemo = styled.div`
  width: 290px;
  height: 180px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  /* margin-bottom: 20px; */
`;

const JustLine = styled.div`
  width: 280px;
  height: 2px;
  background-color: #d9d9d9;
`;
const ClubPw = styled.div`
  width: 280px;
  height: 65px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;

  /* justify-content: space-between; */
`;
const Pw = styled.div`
  width: 60%;
  margin-left: 10px;
`;
const SettingLogo = styled.div`
  width: 20px;
  height: 20px;
`;

const CabinetNumInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  /* justify-content: start; */
  flex-wrap: wrap;
  align-items: center;
  /* margin-bottom: 20px; */
  /* padding-bottom: 20px; */
  /* margin-left: 30px; */
  /* padding-top: 30px; */
`;
const CabinetNum = styled.div`
  width: 90px;
  height: 90px;
  background-color: #eeeeee;
  border-radius: 16px;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CabinetSideInfo = styled.div`
  width: 150px;
  height: 90px;
  margin-left: 30px;
  display: flex;
  /* justify-content: space-evenly; */
  justify-content: space-around;
  /* justify-content: center; */
  flex-direction: column;
  align-content: space-around;
`;
const SideInfoClubName = styled.div`
  font-weight: bold;
  font-size: 18px;
`;
const SideInfoFloor = styled.div`
  font-size: 16px;
  color: gray;
`;
const SideInfoMember = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: start;
`;
const UserId = styled.div`
  margin-left: 10px;
`;

const LeaderIcon = styled.div`
  img {
    width: 22px;
    height: 18px;
  }
`;
const MemoIcon = styled.div`
  width: 20px;
  height: 20px;
`;
const TextCount = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: end;
  margin-top: 10px;
  /* justify-content: end; */
  /* justify-content: initial; */
`;

export default ClubCabinetInfo;
