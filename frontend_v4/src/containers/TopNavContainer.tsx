import { currentFloorNumberState } from "@/recoil/atoms";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import TopNavButtonsContainer from "./TopNavButtonsContainer";

const locations = ["새롬관", "서초", "강남"];

interface ILocationListItem {
  location: string;
  onUpdate: React.Dispatch<string>;
  onClose: React.Dispatch<boolean>;
}

const LocationListItem: React.FC<ILocationListItem> = ({
  location,
  onUpdate,
  onClose,
}) => {
  return (
    <LocationListItemStyled
      onClick={() => {
        onUpdate(location);
        onClose(false);
      }}
    >
      {location}
    </LocationListItemStyled>
  );
};

const TopNavContainer = () => {
  const [locationName, setLocationName] = useState("새롬관");
  const [locationClicked, setLocationClicked] = useState(false);
  const setCurrentFloor = useSetRecoilState(currentFloorNumberState);
  const navigate = useNavigate();
  const onClickLogo = () => {
    setCurrentFloor(-1);
    navigate("/home");
  };
  return (
    <TopNavContainerStyled>
      <LogoStyled>
        <LogoDivStyled onClick={onClickLogo}>
          <img src="src/assets/images/logo.svg" alt="" />
        </LogoDivStyled>
        <LocationSelectBoxStyled>
          <span onClick={() => setLocationClicked(!locationClicked)}>
            {locationName}
          </span>
          <LocationListStyled clicked={locationClicked}>
            {locations.map((location, index) => (
              <LocationListItem
                location={location}
                key={index}
                onUpdate={setLocationName}
                onClose={setLocationClicked}
              />
            ))}
          </LocationListStyled>
        </LocationSelectBoxStyled>
      </LogoStyled>
      <TopNavButtonsContainer />
    </TopNavContainerStyled>
  );
};

const TopNavContainerStyled = styled.nav`
  width: 100%;
  height: 80px;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main-color);
  padding: 0 28px;
  color: var(--white);
`;

const LogoStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const LogoDivStyled = styled.div`
  width: 35px;
  height: 35px;
`;

const LocationSelectBoxStyled = styled.span`
  position: relative;
  margin-left: 40px;
  font-size: 24px;
  font-family: var(--location-font);
  cursor: pointer;
  & > span {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }
  & > span:hover {
    opacity: 0.9;
  }
  & > span::after {
    content: "";
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: url(src/assets/images/select.svg) no-repeat 100%;
  }
`;

const LocationListStyled = styled.ul<{ clicked: boolean }>`
  position: absolute;
  top: 30px;
  left: -15px;
  padding: 5px 10px;
  background: var(--white);
  opacity: 0.9;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.clicked ? "block" : "none")};
`;

const LocationListItemStyled = styled.li`
  width: 80px;
  height: 40px;
  color: var(--black);
  font-size: 1.25rem;
  font-family: var(--main-font);
  line-height: 40px;
  text-indent: 5px;
  &:hover {
    opacity: 0.8;
  }
`;

export default TopNavContainer;
