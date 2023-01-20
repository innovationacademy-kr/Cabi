import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "@/recoil/atoms";
import TopNav from "@/components/TopNav/TopNav.container";
import LeftNav from "@/components/LeftNav/LeftNav";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import { getCookie } from "@/api/react_cookie/cookies";
import { axiosMyInfo } from "@/api/axios/axios.custom";
import { UserDto } from "@/types/dto/user.dto";
import styled, { css } from "styled-components";
import CabinetInfoAreaContainer from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import useMenu from "@/hooks/useMenu";
import MapInfoContainer from "@/components/MapInfo/MapInfo.container";
import LentLogContainer from "@/components/LentLog/LentLog.container";

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

  const { closeAll } = useMenu();

  const handleClickBg = () => {
    closeAll();
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
          <MainStyled>
            <MenuBgStyled onClick={handleClickBg} id="menuBg" />
            <Outlet />
          </MainStyled>
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            isHomePage={isHomePage}
          >
            <CabinetInfoAreaContainer />
          </DetailInfoContainerStyled>
          <LentLogContainer />
          <MapInfoContainer />
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
  padding: 45px 40px 20px;
  position: relative;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-y: auto;
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

const MenuBgStyled = styled.div`
  position: none;
`;
