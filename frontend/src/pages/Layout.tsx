import React, { useEffect, useState } from "react";
import { set } from "react-ga";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import { serverTimeState, userState } from "@/recoil/atoms";
import CabinetInfoAreaContainer from "@/components/CabinetInfoArea/CabinetInfoArea.container";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import LeftNav from "@/components/LeftNav/LeftNav";
import MapInfoContainer from "@/components/MapInfo/MapInfo.container";
import OverduePenaltyModal from "@/components/Modals/OverduePenaltyModal/OverduePenaltyModal";
import TopNav from "@/components/TopNav/TopNav.container";
import { additionalModalType } from "@/assets/data/maps";
import { UserDto, UserInfo } from "@/types/dto/user.dto";
import { axiosMyInfo } from "@/api/axios/axios.custom";
import { getCookie } from "@/api/react_cookie/cookies";
import useMenu from "@/hooks/useMenu";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myInfoData, setMyInfoData] = useState<UserInfo | null>(null);
  const setServerTime = useSetRecoilState<Date>(serverTimeState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const token = getCookie("access_token");

  const isRootPath: boolean = location.pathname === "/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isMainPage: boolean = location.pathname === "/main";

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getMyInfo = async () => {
    try {
      const {
        data: myInfo,
        headers: { date: serverTime },
      } = await axiosMyInfo();
      setServerTime(new Date(serverTime)); // 접속 후 최초 서버 시간을 가져옴
      setMyInfoData(myInfo);
      setUser(myInfo);
      setIsValidToken(true);
      if (myInfo.unbannedAt) {
        openModal();
      }
      if (isRootPath || isLoginPage) {
        navigate("/home");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const savedColor = localStorage.getItem("mainColor");
  const root: HTMLElement = document.documentElement;

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");
    else if (token) {
      getMyInfo();
      // 서버 시간
      const serverTimer = setInterval(() => {
        setServerTime((prevTime) => new Date(prevTime.getTime() + 1000));
      }, 1000);

      return () => clearInterval(serverTimer);
    }
  }, []);

  useEffect(() => {
    root.style.setProperty("--main-color", savedColor);
    if (savedColor !== "#9747ff")
      root.style.setProperty("--lightpurple-color", "#7b7b7b");
  }, [savedColor]);

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
          <LeftNav isVisible={isMainPage} />
          <MainStyled>
            <MenuBgStyled onClick={handleClickBg} id="menuBg" />
            <Outlet />
          </MainStyled>
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            isHomePage={!isMainPage}
          >
            <CabinetInfoAreaContainer />
          </DetailInfoContainerStyled>
          <MapInfoContainer />
          {isModalOpen && myInfoData && myInfoData.unbannedAt !== undefined && (
            <OverduePenaltyModal
              status={additionalModalType.MODAL_OVERDUE_PENALTY}
              closeModal={closeModal}
              unbannedAt={myInfoData.unbannedAt}
            />
          )}
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
