import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled, { css } from "styled-components";
import {
  darkModeState,
  myClubListState,
  serverTimeState,
  targetClubInfoState,
  userState,
} from "@/Cabinet/recoil/atoms";
import CabinetInfoAreaContainer from "@/Cabinet/components/CabinetInfoArea/CabinetInfoArea.container";
import ClubMemberInfoAreaContainer from "@/Cabinet/components/Club/ClubMemberInfoArea/ClubMemberInfoArea.container";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import LeftNav from "@/Cabinet/components/LeftNav/LeftNav";
import MapInfoContainer from "@/Cabinet/components/MapInfo/MapInfo.container";
import OverduePenaltyModal from "@/Cabinet/components/Modals/OverduePenaltyModal/OverduePenaltyModal";
import TopNavContainer from "@/Cabinet/components/TopNav/TopNav.container";
import { additionalModalType } from "@/Cabinet/assets/data/maps";
import {
  ClubPaginationResponseDto,
  ClubResponseDto,
} from "@/Cabinet/types/dto/club.dto";
import { UserDto, UserInfo } from "@/Cabinet/types/dto/user.dto";
import { axiosMyClubList, axiosMyInfo } from "@/Cabinet/api/axios/axios.custom";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";
import useMenu from "@/Cabinet/hooks/useMenu";

const root: HTMLElement = document.documentElement;
const token = getCookie("access_token");

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myInfoData, setMyInfoData] = useState<UserInfo | null>(null);
  const setServerTime = useSetRecoilState<Date>(serverTimeState);
  const setUser = useSetRecoilState<UserDto>(userState);
  const setClubList =
    useSetRecoilState<ClubPaginationResponseDto>(myClubListState);
  const setTargetClubInfo =
    useSetRecoilState<ClubResponseDto>(targetClubInfoState);
  const navigate = useNavigate();
  const location = useLocation();
  const { closeAll } = useMenu();

  const isRootPath: boolean = location.pathname === "/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isMainPage: boolean = location.pathname === "/main";

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickBg = () => {
    closeAll();
  };

  const getMyInfo = async () => {
    try {
      const {
        data: myInfo,
        data: { date: serverTime },
      } = await axiosMyInfo();

      const formattedServerTime = serverTime.split(" KST")[0];
      setServerTime(new Date(formattedServerTime)); // 접속 후 최초 서버 시간을 가져옴
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

  const getMyClubList = async () => {
    try {
      const response = await axiosMyClubList();
      const result = response.data.result;
      const totalLength = response.data.totalLength;
      if (totalLength !== 0) {
        setClubList({ result, totalLength } as ClubPaginationResponseDto);
        setTargetClubInfo(result[0]);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!token && !isLoginPage) navigate("/login");
    else if (token) {
      getMyInfo();
      getMyClubList();
      // 서버 시간
      const serverTimer = setInterval(() => {
        setServerTime((prevTime) => new Date(prevTime.getTime() + 1000));
      }, 1000);

      return () => clearInterval(serverTimer);
    }
  }, []);

  const savedMainColor = localStorage.getItem("main-color");
  const savedSubColor = localStorage.getItem("sub-color");
  const savedMineColor = localStorage.getItem("mine-color");

  useEffect(() => {
    root.style.setProperty("--main-color", savedMainColor);
    root.style.setProperty("--sub-color", savedSubColor);
    root.style.setProperty("--mine-color", savedMineColor);
  }, [savedMainColor, savedSubColor, savedMineColor]);

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
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            isHomePage={!isMainPage}
          >
            <CabinetInfoAreaContainer />
          </DetailInfoContainerStyled>
          <ClubMemberInfoAreaContainer />
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
  background-color: var(--bg-color);
  overflow-y: auto;
  ${(props) =>
    props.isHomePage &&
    css`
      position: fixed;
      top: 120px;
      right: 0;
      height: calc(100% - 120px);
      z-index: 9;
      transform: translateX(120%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 0 0 40px 0 var(--border-shadow-color-200);
      &.on {
        transform: translateX(0%);
      }
    `}
`;

const MenuBgStyled = styled.div`
  position: none;
`;

export default Layout;