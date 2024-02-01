import { useState } from "react";
import styled from "styled-components";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";
import Card from "./Card";

const ClubCabinetInfoCard = ({
  clubInfo,
}: {
  clubInfo: ClubInfoResponseDto;
}) => {
  const [pw, setPw] = useState<string>("");

  return (
    <Card
      title="동아리 사물함"
      width="380px"
      height="285px"
      buttons={[
        {
          label: "설정",
          onClick: () => {},
          isClickable: false,
        },
      ]}
    >
      <ClubCabinetInfoContainerStyled>
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
            <Pw pw={pw} pwCover={"****"}>
              {"****"}
            </Pw>
          </PsSpan>
          <SettingLogo>
            {" "}
            <img src="/src/assets/images/setting.svg"></img>
          </SettingLogo>
        </ClubPw>
      </ClubCabinetInfoContainerStyled>
    </Card>
  );
};

const ClubCabinetInfoContainerStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`;

const JustLine = styled.div`
  width: 280px;
  height: 2px;
  background-color: #d9d9d9;
  margin: 1.5rem 0;
`;

const ClubPw = styled.div`
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

const PsSpan = styled.span`
  width: 60%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Pw = styled.span<{ pw: string; pwCover: string }>`
  height: 100%;
  position: relative;
  margin-left: 10px;
  line-height: 25px;
  padding-top: ${(props) => (props.pw ? "5px" : "")};
  font-size: ${(props) => (props.pw ? "20px" : "12px")};

  &:hover::after {
    content: "${(props) => (props.pw ? props.pw : props.pwCover)}";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0%;
    left: 0%;
    background-color: #fff;
    font-size: ${(props) => (props.pw ? "16px" : "12px")};
  }
`;

const SettingLogo = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
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

export default ClubCabinetInfoCard;
