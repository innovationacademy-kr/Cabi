import styled from "styled-components";

interface ILeftMainNav {
  pathname: string;
  onClickHomeButton: React.MouseEventHandler;
  floors: number[];
  currentFloor: number;
  onClickFloorButton: Function;
  onClickLogoutButton: React.MouseEventHandler;
}

const LeftMainNav = ({
  pathname,
  floors,
  currentFloor,
  onClickHomeButton,
  onClickFloorButton,
  onClickLogoutButton,
}: ILeftMainNav) => {
  return (
    <LeftNavStyled>
      <TopSectionStyled>
        <TopBtnsStyled>
          <TopBtnStyled
            className={pathname == "/home" ? "leftNavButtonActive" : ""}
            onClick={onClickHomeButton}
          >
            Home
          </TopBtnStyled>
          {floors &&
            floors.map((floor, index) => (
              <TopBtnStyled
                className={
                  pathname != "/home" && floor === currentFloor
                    ? "leftNavButtonActive"
                    : ""
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
          <BottomBtnStyled src={"/src/assets/images/search.svg"}>
            <div></div>
            Search
          </BottomBtnStyled>
          <BottomBtnStyled src={"/src/assets/images/log.svg"}>
            <div></div>
            Log
          </BottomBtnStyled>
          <BottomBtnStyled src={"/src/assets/images/slack.svg"}>
            <a
              href="https://42born2code.slack.com/archives/C02V6GE8LD7"
              target="_black"
            >
              <div></div>
              Contact
            </a>
          </BottomBtnStyled>
          <BottomBtnStyled src={"/src/assets/images/circleIconGray.svg"}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfp-d7qq8gTvmQe5i6Gtv_mluNSICwuv5pMqeTBqt9NJXXP7w/closedform"
              target="_blank"
            >
              <div></div>
              Circle
            </a>
          </BottomBtnStyled>

          <BottomBtnStyled
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
