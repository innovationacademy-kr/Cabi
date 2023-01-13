import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms";
import TopNav from "@/components/TopNav/TopNav.container";
import LeftNav from "@/components/LeftNav/LeftNav";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { getCookie } from "@/api/react_cookie/cookies";
import { axiosMyInfo } from "@/api/axios/axios.custom";
import { UserDto } from "@/types/dto/user.dto";
import styled, { css } from "styled-components";
import CabinetInfoAreaContainer from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import MapInfo from "@/components/MapInfo/MapInfo";
import { currentFloorSectionState } from "@/recoil/selectors";
import { currentSectionNameState } from "@/recoil/atoms";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie("access_token");

  const isRootPath: boolean = location.pathname === "/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isHomePage: boolean = location.pathname === "/home";

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");

    if (token) {
      setIsLoading(true);
      const getMyInfo = async () => {
        try {
          const { data: myInfo } = await axiosMyInfo();
          setUser(myInfo);
          setIsValidToken(true);
          if (isRootPath || isLoginPage) navigate("/home");
        } catch (error) {
          console.log(error);
        }
      };
      getMyInfo();
    }
  }, []);

  const [touchOffset, setTouchOffset] = useState(0);

  const sectionList = useRecoilValue<Array<string>>(currentFloorSectionState);
  const [currentSectionName, setCurrentSectionName] = useRecoilState<string>(
    currentSectionNameState
  );
  const currentSectionIdx = sectionList.findIndex(
    (sectionName) => sectionName === currentSectionName
  );
  const moveToLeftSection = () => {
    if (currentSectionIdx <= 0) {
      setCurrentSectionName(sectionList[sectionList.length - 1]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx - 1]);
    }
  };

  const moveToRightSection = () => {
    if (currentSectionIdx >= sectionList.length - 1) {
      setCurrentSectionName(sectionList[0]);
    } else {
      setCurrentSectionName(sectionList[currentSectionIdx + 1]);
    }
  };

  const swipeSection = (last: number) => {
    if (last > touchOffset) moveToLeftSection();
    else moveToRightSection();
  };

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      {isValidToken && <TopNav setIsLoading={setIsLoading} />}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <WrapperStyled>
          <LeftNav isVisible={!isHomePage} />
          <MainStyled
            onTouchStart={(e: React.TouchEvent) =>
              setTouchOffset(e.changedTouches[0].screenX)
            }
            onTouchEnd={(e: React.TouchEvent) =>
              swipeSection(e.changedTouches[0].screenX)
            }
          >
            <Outlet />
          </MainStyled>
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            isHomePage={isHomePage}
          >
            {/* <LentLog /> */}
            <CabinetInfoAreaContainer />
          </DetailInfoContainerStyled>
          <MapInfo />
        </WrapperStyled>
      )}
    </React.Fragment>
  );
};

export default Layout;

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  user-select: none;
`;

const DetailInfoContainerStyled = styled.div<{ isHomePage: boolean }>`
  min-width: 330px;
  padding-top: 45px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  ${(props) =>
    props.isHomePage &&
    css`
      position: fixed;
      top: 80px;
      right: 0;
      height: calc(100% - 80px);
      z-index: 9;
      transform: translateX(120%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 0 0 40px 0 var(--bg-shadow);
      &.on {
        transform: translateX(0%);
      }
    `}
`;
