import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TopNav from "@/components/TopNav";
import LeftNavAreaContainer from "@/containers/LeftNavAreaContainer";
import HomeInfo from "@/components/HomeInfo";
import LoadingModal from "@/components/LoadingModal";
import "@/assets/css/homePage.css";

import { getCookie } from "@/api/react_cookie/cookies";
import { useSetRecoilState } from "recoil";
import {
  myCabinetInfoState,
  userState,
  toggleCabinetInfoState,
  toggleMapInfoState,
} from "@/recoil/atoms";
import { MyCabinetInfoResponseDto } from "@/types/dto/cabinet.dto";
import { UserDto } from "@/types/dto/user.dto";
import { axiosMyInfo, axiosMyLentInfo } from "@/api/axios/axios.custom";

import CabinetInfoArea from "@/components/CabinetInfoArea";

import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);
  const navigator = useNavigate();
  const token = getCookie("access_token");
  const setUser = useSetRecoilState<UserDto>(userState);
  const setMyLentInfo =
    useSetRecoilState<MyCabinetInfoResponseDto>(myCabinetInfoState);
  let loading: boolean = false;

  useEffect(() => {
    if (!token) navigator("/");
    async function getData() {
      try {
        const { data: myInfo } = await axiosMyInfo();
        const { data: myLentInfo } = await axiosMyLentInfo();

        setUser(myInfo);
        setMyLentInfo(myLentInfo);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, []);

  return (
    <>
      <TopNav />
      <WapperStyled>
        <LeftNavAreaContainer style={{ display: "none" }} />
        <MainStyled>{loading ? <LoadingModal /> : <HomeInfo />}</MainStyled>
        <DetailInfoContainerStyled
          id="cabinetDetailArea"
          className={toggleCabinetInfo ? "on" : ""}
        >
          <CabinetInfoArea />
        </DetailInfoContainerStyled>
        <MapInfoContainer />
      </WapperStyled>
    </>
  );
};

const WapperStyled = styled.div`
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

const DetailInfoContainerStyled = styled.div`
  min-width: 330px;
  padding-top: 45px;
  border-left: 1px solid var(--line-color);
  background-color: var(--white);
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
`;

export default HomePage;
