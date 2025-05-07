import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import TopNavDomainGroup from "@/Cabinet/components/TopNav/TopNavDomainGroup/TopNavDomainGroup";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import LeftNav from "@/Presentation_legacy/components/LeftNav/LeftNav";
import TopNavContainer from "@/Presentation_legacy/components/TopNav/TopNav.container";

const body: HTMLElement = document.body;
const root: HTMLElement = document.documentElement;

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const { closeAll } = useMenu();

  const token = getCookie("access_token");

  const isRootPath: boolean = location.pathname === "/presentation/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isHomePage: boolean = location.pathname === "/home";

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

  const handleClickBg = () => {
    closeAll();
  };

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");
    else if (token) getMyInfo();
  }, []);

  useEffect(() => {
    root.style.setProperty(
      "--sys-main-color",
      "var(--sys-presentation-main-color)"
    );
    root.style.setProperty(
      "--sys-sub-color",
      "var(--sys-presentation-sub-color)"
    );
    body.style.setProperty(
      "--sys-main-color",
      "var(--sys-presentation-main-color)"
    );
    body.style.setProperty(
      "--sys-sub-color",
      "var(--sys-presentation-sub-color)"
    );
  }, []);

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      <TopNavDomainGroup />
      <div className="font-pretendard">
        <TopNavContainer setIsLoading={setIsLoading} />
        <WrapperStyled>
          <MainStyled>
            <MenuBgStyled onClick={handleClickBg} id="menuBg" />
            <Outlet />
          </MainStyled>
        </WrapperStyled>
      </div>
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

const MenuBgStyled = styled.div`
  position: none;
`;

export default Layout;
