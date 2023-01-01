import React from "react";
import styled from "styled-components";
import InfoContainer from "@/containers/InfoContainer";

import { toggleCabinetInfoState, toggleMapInfoState } from "@/recoil/atoms";

import CabinetInfoArea from "@/components/CabinetInfoArea";

import { useRecoilValue } from "recoil";
import MapInfoContainer from "@/containers/MapInfoContainer";

const HomePage = () => {
  const toggleCabinetInfo = useRecoilValue(toggleCabinetInfoState);
  const toggleMapInfo = useRecoilValue(toggleMapInfoState);

  return (
    <>
      <MainStyled>
        <InfoContainer />
      </MainStyled>
      {toggleCabinetInfo && <CabinetInfoArea />}
      {toggleMapInfo && <MapInfoContainer />}
    </>
  );
};

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

export default HomePage;
