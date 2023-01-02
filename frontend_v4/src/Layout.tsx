import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toggleCabinetInfoState, userState } from "@/recoil/atoms";
import TopNav from "@/components/TopNav";
import LeftNavAreaContainer from "./containers/LeftNavAreaContainer";
import LoadingModal from "@/components/LoadingModal";
import { getCookie } from "@/api/react_cookie/cookies";
import { axiosMyInfo } from "@/api/axios/axios.custom";
import { UserDto } from "@/types/dto/user.dto";
import styled, { css } from "styled-components";
import CabinetInfoArea from "./components/CabinetInfoArea";
import MapInfoContainer from "./containers/MapInfoContainer";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
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

  return isLoginPage ? (
    <Outlet />
  ) : (
    <React.Fragment>
      {isValidToken && <TopNav setIsLoading={setIsLoading} />}
      {isLoading ? (
        <LoadingModal />
      ) : (
        <WrapperStyled>
          <LeftNavAreaContainer isVisible={!isHomePage} />
          <MainStyled>
            <Outlet />
          </MainStyled>
          <DetailInfoContainerStyled
            id="cabinetDetailArea"
            className={toggleCabinetInfo ? "on" : ""}
            isHomePage={isHomePage}
          >
            <CabinetInfoArea />
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
`;

const DetailInfoContainerStyled = styled.div<{ isHomePage: boolean }>`
  min-width: 330px;
  padding-top: 45px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
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
