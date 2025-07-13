import Footer from "@/components/ui/footer";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import TopNavDomainGroup from "@/Cabinet/components/TopNav/TopNavDomainGroup/TopNavDomainGroup";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";
import TopNavContainer from "@/Presentation/components/TopNav/TopNav.container";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const { closeAll } = useMenu();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const token = getCookie("access_token");
  const isLoginPage = location.pathname === "/login";
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/presentations/home");
  }, []);

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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  const handleClickBg = () => {
    closeAll();
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <PageContainer>
      <HeaderSection>
        <TopNavDomainGroup />
        <TopNavContainer setIsLoading={setIsLoading} />
      </HeaderSection>
      <ContentArea>
        <ScrollArea ref={scrollAreaRef} onClick={handleClickBg}>
          <MainStyled>
            <MenuBgStyled id="menuBg" />
            <Outlet />
          </MainStyled>
          <Footer />
        </ScrollArea>
      </ContentArea>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const HeaderSection = styled.header`
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid #bcbcbc;
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const MainStyled = styled.main`
  width: 100%;
  user-select: none;
  min-height: calc(100vh - 110px);
`;

const MenuBgStyled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

export default Layout;
