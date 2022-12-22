import React from "react";
import styled from "styled-components";
import exitButton from "@/assets/images/exitButton.svg";
import MapGridContainer from "./MapGridContainer";
import { useState } from "react";

const floorInfo = ["2층", "3층", "4층", "5층"];

const FloorSelectContainer = () => {
  return (
    <SelectStyled name="floor">
      <option defaultValue="2층" value="2층">
        2층
      </option>
      <option value="3층">3층</option>
      <option value="4층">4층</option>
    </SelectStyled>
  );
};

const SelectContainer = ({
  floorInfo,
  currentFloor,
}: {
  floorInfo: string[];
  currentFloor: string;
}) => {
  /*
   */
  const [toggle, setToggle] = useState<boolean>(false);
  const onClick = () => {
    setToggle(!toggle);
  };

  return (
    <div style={{ position: "relative" }}>
      <CurrentFloorStyled onClick={onClick}>{currentFloor}</CurrentFloorStyled>
      {toggle && <OptionsContainer floorInfo={floorInfo} />}
    </div>
  );
};

const CurrentFloorStyled = styled.div`
  background: var(--main-color);
  color: white;
  cursor: pointer;
  width: 65px;
  height: 35px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const OptionsContainerStyled = styled.div`
  position: absolute;
  left: 0;
  top: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 1px gray;
  overflow: hidden;
`;

const OptionStyled = styled.div`
  width: 65px;
  height: 35px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--white);
  color: black;
  cursor: pointer;
`;

const OptionsContainer: React.FC<{ floorInfo: string[] }> = (props) => {
  return (
    <OptionsContainerStyled>
      {props.floorInfo.map((info, idx) => (
        <OptionStyled key={idx}>{info}</OptionStyled>
      ))}
    </OptionsContainerStyled>
  );
};

const MapInfoContainer = () => {
  return (
    <MapInfoContainerStyled>
      <HeaderStyled>
        <H2Styled>지도</H2Styled>
        <img src={exitButton} style={{ width: "24px", cursor: "pointer" }} />
      </HeaderStyled>
      <SelectContainer floorInfo={floorInfo} currentFloor="2층" />
      <MapGridContainer />
    </MapInfoContainerStyled>
  );
};

const H2Styled = styled.h2`
  font-size: 1.5rem;
`;

const SelectStyled = styled.select`
  background: var(--main-color);
  padding: 5px 10px;
  border-radius: 5px;
  margin-bottom: 50px;
  & > option {
    background: var(--main-color);
    padding: 5px 10px;
    border-radius: 5px;
  }
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
  width: 330px;
  /* height : 100%; */
  height: 840px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--white);
`;

export default MapInfoContainer;
