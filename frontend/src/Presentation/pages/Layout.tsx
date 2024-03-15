import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import LeftNav from "@/Cabinet/components/LeftNav/LeftNav";
import TopNavContainer from "@/Cabinet/components/TopNav/TopNav.container";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";

const token = getCookie("access_token");

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();

  const isRootPath: boolean = location.pathname === "/presentation/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isMainPage: boolean = location.pathname === "/main";

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      setUser(myInfo);
      setIsValidToken(true);
      if (isRootPath || isLoginPage) {
        navigate("/presentation/home");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const root: HTMLElement = document.documentElement;

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");
    else if (token) getMyInfo();
  }, []);

  useEffect(() => {
    root.style.setProperty("--main-color", "#3f69fd");
    // root.style.setProperty("--sub-color", "");
  }, []);

  const { closeAll } = useMenu();

  const handleClickBg = () => {
    closeAll();
  };

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      {isValidToken && <TopNavContainer setIsLoading={setIsLoading} />}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <WrapperStyled>
          <LeftNav isVisible={isMainPage} />
          <MainStyled>
            <MenuBgStyled onClick={handleClickBg} id="menuBg" />
            <Outlet />
          </MainStyled>
        </WrapperStyled>
      )}
    </React.Fragment>
  );
};

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-y: auto;
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

export default Layout;
