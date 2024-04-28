import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import LeftNav from "@/Presentation/components/LeftNav/LeftNav";
import AdminTopNavContainer from "@/Presentation/components/TopNav/AdminTopNav.container";

const token = getCookie("admin_access_token");
const body: HTMLElement = document.body;

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
    body.style.setProperty(
      "--sys-main-color",
      "var(--sys-presentation-main-color)"
    );
    body.style.setProperty(
      "--sys-sub-color",
      "var(--sys-presentation-sub-color)"
    );
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
