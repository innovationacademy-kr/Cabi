import { useEffect, useState } from "react";
import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import ClubPasswordModal from "./ClubPasswordModal";

const ClubDetail = ({ clubInfo }: { clubInfo: ClubInfoResponseDto }) => {
  const [password, setPassword] = useState<string>("1111");
  const [pwCover, setPwCover] = useState<string>("****");
  const [isModalOpenTest, setIsModalOpenTest] = useState<boolean>(false);

  useEffect(() => {
    if (clubInfo.clubMemo) {
      // console.log("hi");
      setPassword(clubInfo.clubMemo.toString());
    }
  }, [clubInfo]);

  const handleSettingLogoClick = () => {
    setIsModalOpenTest(true);
  };

  return (
    <ClubBasicInfoBoxStyled>
      <CabinetNumStyled>{clubInfo.visibleNum}</CabinetNumStyled>
      <CabinetSideInfoStyled>
        <SideInfoClubNameStyled>{clubInfo.clubName}</SideInfoClubNameStyled>
        <SideInfoFloorStyled>
          {clubInfo.floor}층 {clubInfo.section}
        </SideInfoFloorStyled>
        <SideInfoMemberStyled>
          <LeaderIconStyled>
            <img src="/src/assets/images/leader.svg"></img>
          </LeaderIconStyled>
          <UserIdStyled>{clubInfo.clubMaster}</UserIdStyled>
        </SideInfoMemberStyled>
      </CabinetSideInfoStyled>
      <JustLineStyled></JustLineStyled>
      <ClubPwStyled>
        비밀번호
        <PsSpanStyled>
          <PwStyled password={password}>{pwCover}</PwStyled>
        </PsSpanStyled>
        <SettingLogoStyled>
          {" "}
          <img
            src="/src/assets/images/setting.svg"
            onClick={handleSettingLogoClick}
          ></img>
        </SettingLogoStyled>
      </ClubPwStyled>
      <ClubPasswordModal
        password={password}
        setPassword={setPassword}
        isModalOpenTest={isModalOpenTest}
        setIsModalOpenTest={setIsModalOpenTest}
      />
    </ClubBasicInfoBoxStyled>
  );
};

const ClubBasicInfoBoxStyled = styled.div`
  width: 380px;
  height: 285px;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const JustLineStyled = styled.div`
  width: 280px;
  height: 2px;
  background-color: #d9d9d9;
  margin: 30px 0px 30px 0px;
`;

const ClubPwStyled = styled.div`
  width: 280px;
  height: 65px;
  background-color: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const PsSpanStyled = styled.span`
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const PwStyled = styled.span<{ password: string }>`
  height: 100%;
  position: relative;
  margin-left: 10px;
  line-height: 25px;
  padding-top: 5px;
  font-size: 20px;

  &:hover::after {
    content: "${(props) => props.password}";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
    left: 0%;
    background-color: #fff;
    font-size: 16px;
  }
`;

const SettingLogoStyled = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CabinetNumInfoStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const CabinetNumStyled = styled.div`
  width: 90px;
  height: 90px;
  background-color: #eeeeee;
  border-radius: 16px;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CabinetSideInfoStyled = styled.div`
  width: 150px;
  height: 90px;
  margin-left: 20px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-content: space-around;
`;

const SideInfoClubNameStyled = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const SideInfoFloorStyled = styled.div`
  font-size: 16px;
  color: gray;
`;

const SideInfoMemberStyled = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: start;
`;

const UserIdStyled = styled.div`
  margin-left: 10px;
`;

const LeaderIconStyled = styled.div`
  img {
    width: 22px;
    height: 18px;
  }
`;

export default ClubDetail;
