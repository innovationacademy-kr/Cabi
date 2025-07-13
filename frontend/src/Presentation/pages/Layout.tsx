import Footer from "@/components/ui/footer";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { userState } from "@/Cabinet/recoil/atoms";
import TopNavDomainGroup from "@/Cabinet/components/TopNav/TopNavDomainGroup/TopNavDomainGroup";
import { UserDto } from "@/Cabinet/types/dto/user.dto";
import { axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import TopNavContainer from "@/Presentation/components/TopNav/TopNav.container";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const { closeAll } = useMenu();

  const token = getCookie("access_token");
  const isLoginPage = location.pathname === "/login";

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await axiosMyInfo();
      setUser(myInfo);
      if (isLoginPage) {
        navigate("/presentations/home", { replace: true });
      }
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token && !isLoginPage) {
      navigate("/login");
    } else if (token) {
      getMyInfo();
    }
  }, [token, isLoginPage, navigate]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
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

  const handleClickBg = () => {
    closeAll();
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <PageContainer>
      <TopNavDomainGroup />
      <TopNavContainer setIsLoading={setIsLoading} />
      <ScrollArea onClick={handleClickBg}>
        <MainStyled>
          <MenuBgStyled id="menuBg" />
          <Outlet />
        </MainStyled>
        <Footer />
      </ScrollArea>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

const MainStyled = styled.main`
  width: 100%;
  user-select: none;
`;

const MenuBgStyled = styled.div`
  position: none;
`;

export default Layout;
