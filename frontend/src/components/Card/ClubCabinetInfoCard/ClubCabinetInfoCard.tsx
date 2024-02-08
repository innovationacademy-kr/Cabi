import { useState } from "react";
import styled from "styled-components";
import Card from "@/components/Card/Card";
import {
  CardContentStyled,
  CardContentWrapper,
  ContentDeatilStyled,
} from "@/components/Card/CardStyles";
import ClubPasswordModalContainer from "@/components/Modals/ClubModal/ClubPasswordModal.container";
import { ClubInfoResponseDto } from "@/types/dto/club.dto";

const ClubCabinetInfoCard = ({
  clubInfo,
  isMaster,
}: {
  clubInfo: ClubInfoResponseDto;
  isMaster: boolean;
}) => {
  const [password, setPassword] = useState<string>(clubInfo.clubMemo || "1111");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  const handleSettingLogoClick = () => {
    setShowPasswordModal(true);
  };

  return (
    <>
      <Card
        title={"사물함 정보"}
        gridArea={"clubCabinetInfo"}
        width={"350px"}
        height={"240px"}
        buttons={
          isMaster
            ? [
                {
                  onClick: handleSettingLogoClick,
                  icon: "/src/assets/images/setting.svg",
                  isClickable: true,
                },
              ]
            : [
                // NOTE: 이 부분은 레이아웃을 유지하기 위한 placeholder 버튼입니다.
                {
                  backgroundColor: "var(--lightgray-color)",
                  onClick: () => {},
                  icon: "",
                  isClickable: false,
                },
              ]
        }
      >
        <>
          <CabinetInfoWrapper>
            <CabinetRectangleStyled>
              {clubInfo.visibleNum}
            </CabinetRectangleStyled>
            <CabinetInfoDetailStyled>
              <ClubNameTextStyled>{clubInfo.clubName}</ClubNameTextStyled>
              <CabinetInfoTextStyled
                fontSize={"1rem"}
                fontColor="var(--gray-color)"
              >
                {clubInfo.floor + "층 - " + clubInfo.section}
              </CabinetInfoTextStyled>
              <CabinetUserListWrapper>
                <CabinetIconStyled />
                <CabinetInfoTextStyled fontSize={"1rem"} fontColor="black">
                  {clubInfo.clubMaster.userName}
                </CabinetInfoTextStyled>
              </CabinetUserListWrapper>
            </CabinetInfoDetailStyled>
          </CabinetInfoWrapper>
          <CardContentWrapper>
            <CardContentStyled>
              <ContentInfoStyled>비밀번호</ContentInfoStyled>
              <ContentDeatilStyled
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
              >
                {showPassword ? password : "****"}
              </ContentDeatilStyled>
            </CardContentStyled>
          </CardContentWrapper>
        </>
      </Card>
      {showPasswordModal && (
        <ClubPasswordModalContainer
          password={password}
          setPassword={setPassword}
          setShowPasswordModal={setShowPasswordModal}
        />
      )}
    </>
  );
};

const CabinetInfoWrapper = styled.div`
  display: flex;
  width: 85%;
  margin: 9px 0 9px 0;
  align-items: center;
`;

const CabinetRectangleStyled = styled.div`
  width: 90px;
  height: 90px;
  line-height: 90px;
  border-radius: 10px;
  margin-right: 20px;
  background-color: var(--full);
  color: var(--black);
  font-size: 2rem;
  text-align: center;
`;

const CabinetInfoDetailStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ClubNameTextStyled = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
  /* margin-bottom: 10px; */
`;

const CabinetInfoTextStyled = styled.div<{
  fontSize: string;
  fontColor: string;
}>`
  font-size: ${(props) => props.fontSize};
  font-weight: 400;
  line-height: 30px;
  color: ${(props) => props.fontColor};
  text-align: center;
  white-space: pre-line;
`;

const CabinetUserListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CabinetIconStyled = styled.div`
  width: 22px;
  height: 18px;
  margin-right: 0.5rem;
  background-image: url("/src/assets/images/leader.svg");
  background-size: contain;
  background-repeat: no-repeat;
`;

const ContentInfoStyled = styled.div<{
  isSelected?: boolean;
  selectedColor?: string;
}>`
  display: flex;
  padding: 8px 10px;

  ${(props) =>
    props.isSelected &&
    `
    background-color: ${props.selectedColor};
    color: white;
    border-radius: 8px;
  `}
`;

export default ClubCabinetInfoCard;
