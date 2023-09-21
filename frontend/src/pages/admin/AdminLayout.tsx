import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import { selectedTypeOnSearchState } from "@/recoil/atoms";
import CabinetInfoAreaContainer from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import LeftNav from "@/components/LeftNav/LeftNav";
import MapInfoContainer from "@/components/MapInfo/MapInfo.container";
import AdminTopNavContainer from "@/components/TopNav/AdminTopNav.container";
import UserInfoAreaContainer from "@/components/UserInfoArea/UserInfoArea.container";
import { getCookie } from "@/api/react_cookie/cookies";
import useMenu from "@/hooks/useMenu";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTypeOnSearch = useRecoilValue(selectedTypeOnSearchState);
  const token = getCookie("admin_access_token");

  const checkPath = () => {
    if (location.pathname === "/admin") return true;
    if (location.pathname === "/admin/") return true;
    if (location.pathname === "/admin/login") return true;
    return false;
  };

  const isLoginPage: boolean = location.pathname === "/admin/login";
  const isMainPage: boolean = location.pathname === "/admin/main";
  const isSearchPage: boolean = location.pathname === "/admin/search";

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/admin/login");
    else if (token) {
      setIsLoading(true);
      if (checkPath()) navigate("/admin/home");
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
      {token && <AdminTopNavContainer setIsLoading={setIsLoading} />}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <WrapperStyled>
          <LeftNav isAdmin={true} isVisible={isMainPage} isProfile={false} />
          <MainStyled>
            <MenuBgStyled onClick={handleClickBg} id="menuBg" />
            <Outlet />
          </MainStyled>
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            isFloat={!isMainPage && !isSearchPage}
          >
            {selectedTypeOnSearch === "USER" ? (
              <UserInfoAreaContainer />
            ) : (
              <CabinetInfoAreaContainer />
            )}
          </DetailInfoContainerStyled>
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

const DetailInfoContainerStyled = styled.div<{ isFloat: boolean }>`
  min-width: 330px;
  padding: 45px 40px 20px;
  position: relative;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
  overflow-x: hidden;
  height: 100%;
  ${(props) =>
    props.isFloat &&
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
