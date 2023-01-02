import React from "react";
import styled from "styled-components";
import LeftNavAreaContainer from "@/containers/LeftNavAreaContainer";
import HomeInfo from "@/components/HomeInfo";
import "@/assets/css/homePage.css";

import { toggleCabinetInfoState } from "@/recoil/atoms";

import CabinetInfoArea from "@/components/CabinetInfoArea";

import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);

  return (
    <>
      <LeftNavAreaContainer style={{ display: "none" }} />
      <MainStyled>
        <HomeInfo />
      </MainStyled>
      <DetailInfoContainerStyled
        id="cabinetDetailArea"
        className={toggleCabinetInfo ? "on" : ""}
      >
        <CabinetInfoArea />
      </DetailInfoContainerStyled>
      <MapInfoContainer />
    </>
  );
};

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
