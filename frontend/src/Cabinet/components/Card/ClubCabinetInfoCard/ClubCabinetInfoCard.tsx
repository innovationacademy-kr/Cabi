import { useState } from "react";
import styled from "styled-components";
import Card from "@/Cabinet/components/Card/Card";
import {
  CardContentStyled,
  ContentDetailStyled,
} from "@/Cabinet/components/Card/CardStyles";
import ClubPasswordModalContainer from "@/Cabinet/components/Modals/ClubModal/ClubPasswordModal.container";
import { ReactComponent as LeaderIcon } from "@/Cabinet/assets/images/leader.svg";
import { ReactComponent as LockIcon } from "@/Cabinet/assets/images/lock.svg";
import { ClubInfoResponseDto } from "@/Cabinet/types/dto/club.dto";

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

  const handleLockLogoClick = () => {
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
                  onClick: handleLockLogoClick,
                  icon: LockIcon,
                  isClickable: true,
                },
              ]
            : [
                // NOTE: 이 부분은 레이아웃을 유지하기 위한 placeholder 버튼입니다.
                {
                  backgroundColor: "var(--card-bg-color)",
                  onClick: () => {},
                  icon: null,
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
                fontColor="var(--gray-line-btn-color)"
              >
                {clubInfo.floor + "층 - " + clubInfo.section}
              </CabinetInfoTextStyled>
              <CabinetUserListWrapper>
                <CabinetIconStyled>
                  <LeaderIcon />
                </CabinetIconStyled>
                <CabinetInfoTextStyled
                  fontSize={"1rem"}
                  fontColor="var(--normal-text-color)"
                >
                  {clubInfo.clubMaster.userName}
                </CabinetInfoTextStyled>
              </CabinetUserListWrapper>
            </CabinetInfoDetailStyled>
          </CabinetInfoWrapper>
          <CardContentWrapper>
            <CardContentStyled
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
            >
              <ContentInfoStyled>비밀번호</ContentInfoStyled>
              <ContentDetailStyled>
                {showPassword ? password : "****"}
              </ContentDetailStyled>
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
  background-color: var(--full-color);
  color: var(--ref-black);
  /* black */
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

  & > svg {
    width: 22px;
    height: 18px;
  }

  & > svg > path {
    stroke: var(--normal-text-color);
    transform: scale(1.1);
  }
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
    color: var(--bg-color);
    border-radius: 8px;
  `}
`;

const CardContentWrapper = styled.div`
  background-color: var(--card-content-bg-color);
  border-radius: 10px;
  padding: 10px 0;
  margin: 5px 5px 5px 5px;
  width: 90%;
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
  }
`;

export default ClubCabinetInfoCard;
