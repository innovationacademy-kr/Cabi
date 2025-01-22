import styled from "styled-components";
import { DISABLED_FLOOR } from "@/Cabinet/pages/AvailablePage";
import { ReactComponent as LogoutImg } from "@/Cabinet/assets/images/close-square.svg";
import { ReactComponent as ClubImg } from "@/Cabinet/assets/images/clubIconGray.svg";
import { ReactComponent as ProfileImg } from "@/Cabinet/assets/images/profile-circle.svg";
import { ReactComponent as SlackAlarmImg } from "@/Cabinet/assets/images/slack-alarm.svg";
import { ReactComponent as SlackImg } from "@/Cabinet/assets/images/slack.svg";
import { ReactComponent as StoreImg } from "@/Cabinet/assets/images/storeIconGray.svg";

interface ILeftMainNav {
  pathname: string;
  onClickHomeButton: React.MouseEventHandler;
  currentBuildingName: string;
  floors: number[];
  currentFloor: number;
  onClickFloorButton: Function;
  onClickLogoutButton: React.MouseEventHandler;
  onClickSlackAlarmButton: React.MouseEventHandler;
  onClickSearchButton: React.MouseEventHandler;
  onClickAdminClubButton: React.MouseEventHandler;
  onClickMainClubButton: React.MouseEventHandler;
  onClickProfileButton: React.MouseEventHandler;
  onClickAvailableButton: React.MouseEventHandler;
  onClickStoreButton: React.MouseEventHandler;
  isAdmin?: boolean;
}

const LeftMainNav = ({
  pathname,
  currentBuildingName,
  floors,
  currentFloor,
  onClickHomeButton,
  onClickFloorButton,
  onClickLogoutButton,
  onClickSlackAlarmButton,
  onClickAdminClubButton,
  onClickMainClubButton,
  onClickProfileButton,
  onClickAvailableButton,
  onClickStoreButton,
  isAdmin,
}: ILeftMainNav) => {
  return (
    <LeftNavStyled>
      <TopSectionStyled>
        <TopBtnsStyled>
          {currentBuildingName === "새롬관" && (
            <>
              <TopBtnStyled
                className={
                  pathname.includes("home")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickHomeButton}
              >
                Home
              </TopBtnStyled>
              {floors &&
                floors.map((floor, index) =>
                  !(!isAdmin && DISABLED_FLOOR.includes(floor.toString())) ? (
                    <TopBtnStyled
                      className={
                        pathname.includes("main") && floor === currentFloor
                          ? "leftNavButtonActive cabiButton"
                          : "cabiButton"
                      }
                      onClick={() => onClickFloorButton(floor)}
                      key={index}
                    >
                      {floor + "층"}
                    </TopBtnStyled>
                  ) : null
                )}
              <TopBtnStyled
                className={
                  pathname.includes("available")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickAvailableButton}
              >
                사용가능
              </TopBtnStyled>
            </>
          )}
        </TopBtnsStyled>
      </TopSectionStyled>
      <BottomSectionStyled>
        <BottomBtnsStyled>
          {isAdmin && (
            <>
              <BottomBtnStyled
                className={
                  pathname.includes("store")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickStoreButton}
              >
                <StoreImg />
                Store
              </BottomBtnStyled>
              <BottomBtnStyled
                className={
                  pathname.includes("slack-alarm")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickSlackAlarmButton}
              >
                <SlackAlarmImg />
                Alarm
              </BottomBtnStyled>
              <BottomBtnStyled className="cabiButton">
                <a
                  href="https://42born2code.slack.com/archives/C02V6GE8LD7"
                  target="_blank"
                  title="슬랙 캐비닛 채널 새창으로 열기"
                >
                  <SlackImg stroke="var(--gray-line-btn-color)" />
                  Contact
                </a>
              </BottomBtnStyled>
              <BottomBtnStyled
                className={
                  pathname.includes("club")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickAdminClubButton}
              >
                <ClubImg />
                Club
              </BottomBtnStyled>
              <BottomBtnStyled
                className="cabiButton"
                onClick={onClickLogoutButton}
              >
                <LogoutImg />
                Logout
              </BottomBtnStyled>
            </>
          )}
          {!isAdmin && currentBuildingName === "새롬관" && (
            <>
              <BottomBtnStyled
                className={
                  pathname.includes("store")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickStoreButton}
              >
                <StoreImg />
                Store
              </BottomBtnStyled>
              <BottomBtnStyled
                className={
                  pathname.includes("clubs")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickMainClubButton}
              >
                <ClubImg />
                Clubs
              </BottomBtnStyled>
              <BottomBtnStyled
                className={
                  pathname.includes("profile")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickProfileButton}
              >
                <ProfileImg />
                Profile
              </BottomBtnStyled>
            </>
          )}
        </BottomBtnsStyled>
      </BottomSectionStyled>
    </LeftNavStyled>
  );
};

const LeftNavStyled = styled.nav`
  width: 90px;
  min-width: 90px;
  position: relative;
  height: 100%;
  border-right: 1px solid var(--line-color);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: var(--size-base);
`;

const TopSectionStyled = styled.section`
  position: relative;
  overflow-x: hidden;
`;

const TopBtnsStyled = styled.ul`
  text-align: center;
  padding: 30px 10px;
`;

const TopBtnStyled = styled.li`
  width: 100%;
  height: 48px;
  line-height: 48px;
  /*   font-size: var(--size-base); */
  font-size: var(--size-base);
  font-weight: 300;
  margin-bottom: 2.5vh;
  border-radius: 10px;
  color: var(--gray-line-btn-color);
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--white-text-with-bg-color);
      background-color: var(--sys-main-color);
    }
  }
`;

const BottomSectionStyled = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 17px;
    margin: 0 auto;
    width: 56px;
    height: 1px;
    background-color: var(--line-color);
  }
`;

const BottomBtnsStyled = styled.ul`
  padding: 30px 10px;
  text-align: center;
`;

const BottomBtnStyled = styled.li`
  width: 100%;
  min-height: 48px;
  line-height: 1.125rem;
  font-size: var(--size-base);
  font-weight: 300;
  margin-top: 2.5vh;
  border-radius: 10px;
  color: var(--gray-line-btn-color);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
  & a {
    color: var(--gray-line-btn-color);
  }
  & div {
    width: 24px;
    height: 24px;
    margin: 0 auto;
    margin-bottom: 4px;
  }
  &.active {
    color: var(--button-line-color);
    svg {
      stroke: var(--button-line-color);
    }
  }
  & > svg {
    margin: 0 auto;
    width: 24px;
    height: 24px;
    stroke: var(--gray-line-btn-color);
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--button-line-color);
      svg {
        stroke: var(--button-line-color);
      }
      a {
        color: var(--button-line-color);
      }
    }
  }
`;

export default LeftMainNav;
