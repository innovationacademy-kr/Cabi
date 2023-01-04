import { useState } from "react";
import styled from "styled-components";
import exitButton from "@/assets/images/exitButton.svg";
import MapGridContainer from "./MapGridContainer";
import useDetailInfo from "@/hooks/useDetailInfo";
import { useRecoilValue } from "recoil";
import { currentLocationFloorState } from "@/recoil/selectors";
import MapFloorSelect from "@/components/MapSelect";

const MapInfoContainer = () => {
  const { closeMap } = useDetailInfo();
  const floorInfo = useRecoilValue(currentLocationFloorState);
  const [floor, setFloor] = useState(floorInfo[0]);
  return (
    <MapInfoContainerStyled id="mapInfo">
      <HeaderStyled>
        <H2Styled>지도</H2Styled>
        <img
          onClick={closeMap}
          src={exitButton}
          style={{ width: "24px", cursor: "pointer" }}
        />
      </HeaderStyled>
      <MapFloorSelect floor={floor} setFloor={setFloor} floorInfo={floorInfo} />
      <MapGridContainer floor={floor} />
    </MapInfoContainerStyled>
  );
};

const H2Styled = styled.h2`
  font-size: 1.5rem;
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 40px 20px 40px 40px;
  color: black;
  font-weight: bold;
`;

const MapInfoContainerStyled = styled.div`
  position: fixed;
  top: 80px;
  right: 0;
  min-width: 330px;
  width: 330px;
  height: calc(100% - 80px);
  z-index: 9;
  transform: translateX(120%);
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 0 40px 0 var(--bg-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
`;

export default MapInfoContainer;
