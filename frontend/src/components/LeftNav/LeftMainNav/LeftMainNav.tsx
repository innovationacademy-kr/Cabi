import styled from "styled-components";
import { ReactComponent as LogoutImg } from "/src/assets/images/close-square.svg";
import { ReactComponent as CulbImg } from "/src/assets/images/clubIconGray.svg";
import { ReactComponent as ProfileImg } from "/src/assets/images/profile-circle.svg";
import { ReactComponent as SearchImg } from "/src/assets/images/search.svg";
import { ReactComponent as SlackImg } from "/src/assets/images/slack.svg";

interface ILeftMainNav {
  pathname: string;
  onClickHomeButton: React.MouseEventHandler;
  floors: number[];
  currentFloor: number;
  onClickFloorButton: Function;
  onClickLogoutButton: React.MouseEventHandler;
  onClickLentLogButton: React.MouseEventHandler;
  onClickSearchButton: React.MouseEventHandler;
  onClickClubButton: React.MouseEventHandler;
  onClickProfileButton: React.MouseEventHandler;
  onClickPendingButton: React.MouseEventHandler;
  isAdmin?: boolean;
}

const LeftMainNav = ({
  pathname,
  floors,
  currentFloor,
  onClickHomeButton,
  onClickFloorButton,
  onClickLogoutButton,
  onClickLentLogButton,
  onClickSearchButton,
  onClickClubButton,
  onClickProfileButton,
  onClickPendingButton,
  isAdmin,
}: ILeftMainNav) => {
  return (
    <LeftNavStyled>
      <TopSectionStyled>
        <TopBtnsStyled>
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
            floors.map((floor, index) => (
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
            ))}
          <TopBtnStyled
            className={
              pathname.includes("pending")
                ? "leftNavButtonActive cabiButton"
                : "cabiButton"
            }
            onClick={onClickPendingButton}
          >
            오픈예정
          </TopBtnStyled>
        </TopBtnsStyled>
      </TopSectionStyled>
      <BottomSectionStyled>
        <BottomBtnsStyled>
          {isAdmin && (
            <>
              <BottomBtnStyled
                className={
                  pathname.includes("search")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickSearchButton}
              >
                <SearchImg stroke="var(--gray-color)" />
                Search
              </BottomBtnStyled>
              <BottomBtnStyled className="cabiButton">
                <a
                  href="https://42born2code.slack.com/archives/C02V6GE8LD7"
                  target="_blank"
                  title="슬랙 캐비닛 채널 새창으로 열기"
                >
                  <SlackImg stroke="var(--gray-color)" />
                  Contact
                </a>
              </BottomBtnStyled>
              <BottomBtnStyled
                className={
                  pathname.includes("club")
                    ? "active cabiButton"
                    : " cabiButton"
                }
                onClick={onClickClubButton}
              >
                <CulbImg stroke="var(--gray-color)" />
                Club
              </BottomBtnStyled>
              <BottomBtnStyled
                className="cabiButton"
                onClick={onClickLogoutButton}
              >
                <LogoutImg stroke="var(--gray-color)" />
                Logout
              </BottomBtnStyled>
            </>
          )}
          {!isAdmin && (
            <BottomBtnStyled
              className={
                pathname.includes("profile")
                  ? "active cabiButton"
                  : " cabiButton"
              }
              onClick={onClickProfileButton}
            >
              <ProfileImg stroke="var(--gray-color)" width={32} height={32} />
              Profile
            </BottomBtnStyled>
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
  font-weight: 300;
  margin-bottom: 2.5vh;
  border-radius: 10px;
  color: var(--gray-color);
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--white);
      background-color: var(--main-color);
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
  font-weight: 300;
  margin-top: 2.5vh;
  border-radius: 10px;
  color: var(--gray-color);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:first-child {
    margin-top: 0;
  }
  & a {
    color: var(--gray-color);
  }
  & div {
    width: 24px;
    height: 24px;
    margin: 0 auto;
    margin-bottom: 4px;
  }
  &.active {
    color: var(--main-color);
    svg {
      stroke: var(--main-color);
    }
  }
  svg {
    margin: 0 auto;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--main-color);
      svg {
        stroke: var(--main-color);
      }
      a {
        color: var(--main-color);
      }
    }
  }
`;

export default LeftMainNav;
