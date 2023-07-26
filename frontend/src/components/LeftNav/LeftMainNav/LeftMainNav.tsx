import styled from "styled-components";

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
        </TopBtnsStyled>
      </TopSectionStyled>
      <BottomSectionStyled>
        <BottomBtnsStyled>
          {isAdmin && (
            <BottomBtnStyled
              className={
                pathname.includes("search")
                  ? "active cabiButton"
                  : " cabiButton"
              }
              src={"/src/assets/images/search.svg"}
              onClick={onClickSearchButton}
            >
              <div></div>
              Search
            </BottomBtnStyled>
          )}
          {!isAdmin && (
            <BottomBtnStyled
              className={
                pathname.includes("log") ? "active cabiButton" : " cabiButton"
              }
              src={"/src/assets/images/log.svg"}
              onClick={onClickLentLogButton}
            >
              <div></div>
              Log
            </BottomBtnStyled>
          )}
          <BottomBtnStyled
            src={"/src/assets/images/slack.svg"}
            className="cabiButton"
          >
            <a
              href="https://42born2code.slack.com/archives/C02V6GE8LD7"
              target="_blank"
              title="슬랙 캐비닛 채널 새창으로 열기"
            >
              <div></div>
              Contact
            </a>
          </BottomBtnStyled>
          <BottomBtnStyled
            src={"/src/assets/images/clubIconGray.svg"}
            className="cabiButton"
          >
            {isAdmin ? (
              <>
                <a onClick={onClickClubButton}>
                  <div></div>
                  Club
                </a>
              </>
            ) : (
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfp-d7qq8gTvmQe5i6Gtv_mluNSICwuv5pMqeTBqt9NJXXP7w/closedform"
                target="_blank"
                title="동아리 사물함 사용 신청서 새창으로 열기"
              >
                <div></div>
                Club
              </a>
            )}
          </BottomBtnStyled>

          <BottomBtnStyled
            className="cabiButton"
            onClick={onClickLogoutButton}
            src={"/src/assets/images/close-square.svg"}
          >
            <div></div>
            Logout
          </BottomBtnStyled>
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

const BottomBtnStyled = styled.li<{ src: string }>`
  width: 100%;
  min-height: 48px;
  line-height: 1.125rem;
  font-weight: 300;
  margin-top: 2.5vh;
  border-radius: 10px;
  color: var(--gray-color);
  cursor: pointer;
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
    background-image: url(${(props) => props.src});
    background-size: cover;
  }
  &.active {
    filter: invert(33%) sepia(55%) saturate(3554%) hue-rotate(230deg)
      brightness(99%) contrast(107%);
  }
  &.active a {
    color: var(--main-color);
  }
  &.active:hover {
    filter: none;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--main-color);
    }
    &:hover a {
      color: var(--main-color);
    }
    &:hover div {
      filter: invert(33%) sepia(55%) saturate(3554%) hue-rotate(230deg)
        brightness(99%) contrast(107%);
    }
  }
`;

export default LeftMainNav;
