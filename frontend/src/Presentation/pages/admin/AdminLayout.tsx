import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import LeftNav from "@/Presentation/components/LeftNav/LeftNav";
import AdminTopNavContainer from "@/Presentation/components/TopNav/AdminTopNav.container";

const token = getCookie("admin_access_token");
const root: HTMLElement = document.documentElement;

const Layout = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage: boolean = location.pathname === "/admin/login";
  const isMainPage: boolean = location.pathname === "/admin/main";
  const { closeAll } = useMenu();

  const checkPath = () => {
    if (location.pathname === "/admin") return true;
    if (location.pathname === "/admin/") return true;
    if (location.pathname === "/admin/login") return true;
    return false;
  };

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/admin/login");
    else if (token) {
      if (checkPath()) navigate("/admin/presentation/detail");
    }
  }, []);

  useEffect(() => {
    root.style.setProperty("--main-color", "var(--presentation-main-color)");
    // root.style.setProperty("--sub-color", "");
  }, []);

  const handleClickBg = () => {
    closeAll();
  };

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      {token && <AdminTopNavContainer />}
      <WrapperStyled>
        <LeftNav isAdmin={true} isVisible={isMainPage} />
        <MainStyled>
          <MenuBgStyled onClick={handleClickBg} id="menuBg" />
          <Outlet />
        </MainStyled>
      </WrapperStyled>
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
  overflow-x: hidden;
  user-select: none;
`;

const MenuBgStyled = styled.div`
  position: none;
`;

export default Layout;
