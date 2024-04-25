import styled from "styled-components";
import { ReactComponent as LogoutImg } from "@/Cabinet/assets/images/close-square.svg";

interface ILeftMainNav {
  pathname: string;
  onClickLogoutButton: React.MouseEventHandler;
  onClickPresentationHomeButton: React.MouseEventHandler;
  onClickPresentationRegisterButton: React.MouseEventHandler;
  onClickPresentationDetailButton: React.MouseEventHandler;
  onClickPresentationLogButton: React.MouseEventHandler;
  isAdmin?: boolean;
}

const LeftMainNav = ({
  pathname,
  onClickLogoutButton,
  onClickPresentationHomeButton,
  onClickPresentationRegisterButton,
  onClickPresentationDetailButton,
  onClickPresentationLogButton,
  isAdmin,
}: ILeftMainNav) => {
  return (
    <LeftNavStyled>
      <TopSectionStyled>
        <TopBtnsStyled>
          {isAdmin ? (
            <TopBtnStyled
              className={
                pathname.includes("presentation/detail")
                  ? "leftNavButtonActive cabiButton"
                  : "cabiButton"
              }
              onClick={onClickPresentationDetailButton}
            >
              {"일정관리"}
            </TopBtnStyled>
          ) : (
            <>
              <TopBtnStyled
                className={
                  pathname.includes("presentation/home")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickPresentationHomeButton}
              >
                Home
              </TopBtnStyled>
              <TopBtnStyled
                className={
                  pathname.includes("presentation/register")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickPresentationRegisterButton}
              >
                발표신청
              </TopBtnStyled>
              <TopBtnStyled
                className={
                  pathname.includes("presentation/log")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickPresentationLogButton}
              >
                발표기록
              </TopBtnStyled>
              <TopBtnStyled
                className={
                  pathname.includes("presentation/detail")
                    ? "leftNavButtonActive cabiButton"
                    : "cabiButton"
                }
                onClick={onClickPresentationDetailButton}
              >
                {isAdmin ? "일정관리" : "상세정보"}
              </TopBtnStyled>
            </>
          )}
        </TopBtnsStyled>
      </TopSectionStyled>
      <BottomSectionStyled>
        <BottomBtnsStyled>
          {!isAdmin && (
            <BottomBtnStyled
              className="cabiButton"
              onClick={onClickLogoutButton}
            >
              <LogoutImg stroke="var(--shared-gray-color-500)" />
              Logout
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
  border-right: 1px solid var(--shared-gray-color-400);
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
  color: var(--shared-gray-color-500);
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--white-text-with-bg-color);
      background-color: var(--presentation-main-color);
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
    background-color: var(--shared-gray-color-400);
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
  color: var(--shared-gray-color-500);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:first-child {
    margin-top: 0;
  }
  & a {
    color: var(--shared-gray-color-500);
  }
  & div {
    width: 24px;
    height: 24px;
    margin: 0 auto;
    margin-bottom: 4px;
  }
  &.active {
    color: var(--presentation-main-color);
    svg {
      stroke: var(--presentation-main-color);
    }
  }
  svg {
    margin: 0 auto;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: var(--presentation-main-color);
      svg {
        stroke: var(--presentation-main-color);
      }
      a {
        color: var(--presentation-main-color);
      }
    }
  }
`;

export default LeftMainNav;
