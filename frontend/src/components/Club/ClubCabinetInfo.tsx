import { useState } from "react";
import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import MemoModalTestContainer from "../Modals/ClubModal/ClubMemoModal.container";

const ClubCabinetInfo = ({ clubInfo }: { clubInfo: ClubInfoResponseDto }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

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
          <CabinetNum>{clubInfo.visibleNum}</CabinetNum>
          <CabinetSideInfo>
            <SideInfoClubName>{clubInfo.clubName}</SideInfoClubName>
            <SideInfoFloor>
              {clubInfo.floor}층 {clubInfo.section}
            </SideInfoFloor>
            <SideInfoMember>
              <LeaderIcon>
                <img src="/src/assets/images/leader.svg"></img>
              </LeaderIcon>
              <UserId>{clubInfo.clubMaster}</UserId>
            </SideInfoMember>
          </CabinetSideInfo>
          <JustLine></JustLine>
          <ClubPw>
            비밀번호
            <PsSpan>
              <Pw>****</Pw>
            </PsSpan>
            <SettingLogo>
              {" "}
              <img src="/src/assets/images/setting.svg"></img>
            </SettingLogo>
          </ClubPw>
        </ClubBasicInfoBox>
        <ClubSubInfoBox>
          <ClubMemoHeader>
            동아리 메모
            <MemoIcon>
              <img src="/src/assets/images/more.svg" onClick={openModal}></img>
            </MemoIcon>
          </ClubMemoHeader>
          <ClubMemo>{text}</ClubMemo>
        </ClubSubInfoBox>
      </ClubInfoBox>
      <MemoModalTestContainer
        onClose={() => closeModal()}
        isModalOpen={isModalOpen}
        text={text}
        setText={setText}
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
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const ClubSubInfoBox = styled.div`
  width: 350px;
  height: 285px;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
`;

const ClubMemoHeader = styled.div`
  font-size: 20px;
  font-weight: bold;
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
  text-align: start;
  font-size: 16px;
  line-height: 22px;
  overflow-y: auto;
  word-break: break-all;
  white-space: pre-wrap;
`;

const JustLine = styled.div`
  width: 280px;
  height: 2px;
  background-color: #d9d9d9;
  margin: 30px 0px 30px 0px;
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
`;

const PsSpan = styled.span`
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Pw = styled.span`
  /* width: 60%; */
  height: 100%;
  position: relative;
  margin-left: 10px;
  font-size: 20px;
  line-height: 25px;
  padding-top: 5px;
  &:hover::after {
    /* padding-top: 5px; */
    content: "1234";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
    left: 0%;
    background-color: #fff;
    font-size: 16px;
  }
`;

const SettingLogo = styled.div`
  width: 20px;
  height: 20px;
`;

const CabinetNumInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
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
  width: 30px;
  height: 20px;
  margin-bottom: 10px;
`;

const TextCount = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: end;
  margin-top: 10px;
`;

export default ClubCabinetInfo;
