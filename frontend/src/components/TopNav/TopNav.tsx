import React from "react";
import { SetterOrUpdater } from "recoil";
import styled from "styled-components";
import TopNavButtonGroup from "@/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";

interface ILocationListItem {
  location: string;
  onUpdate: SetterOrUpdater<string>;
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

const TopNav: React.FC<{
  currentLocationName: string;
  locationsList: Array<string>;
  locationClicked: boolean;
  setLocationClicked: React.Dispatch<boolean>;
  onClickLogo: React.MouseEventHandler;
  setCurrentLocationName: SetterOrUpdater<string>;
}> = (props) => {
  const {
    currentLocationName,
    locationsList,
    locationClicked,
    setLocationClicked,
    onClickLogo,
    setCurrentLocationName,
  } = props;

  return (
    <TopNavContainerStyled id="topNavWrap">
      <LogoStyled>
        <LogoDivStyled onClick={onClickLogo}>
          <img src="/src/assets/images/logo.svg" alt="" />
        </LogoDivStyled>
        <LocationSelectBoxStyled>
          <span onClick={() => setLocationClicked(!locationClicked)}>
            {currentLocationName}
          </span>
          <LocationListStyled clicked={locationClicked}>
            {locationsList.map((location, index) => (
              <LocationListItem
                location={location}
                key={index}
                onUpdate={setCurrentLocationName}
                onClose={setLocationClicked}
              />
            ))}
          </LocationListStyled>
        </LocationSelectBoxStyled>
      </LogoStyled>
      <TopNavButtonGroup />
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
  z-index: 10;
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
    background: url(/src/assets/images/select.svg) no-repeat 100%;
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
  z-index: 100;
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

export default TopNav;
