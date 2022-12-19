import React from "react";
import styled from "styled-components";

const TopNavContainer = () => {
  return (
    <TopNavContainerStyled>
      <LogoStyled>
        <div>
          <img src="src/assets/images/logo.svg" alt="" />
        </div>
        <LocationSelectBoxStyled>새롬관</LocationSelectBoxStyled>
      </LogoStyled>
      <MapButtonStyled>
        <img src="src/assets/images/map.svg" alt="" />
      </MapButtonStyled>
    </TopNavContainerStyled>
  );
};

const TopNavContainerStyled = styled.nav`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main-color);
  padding: 0 20px;
  color: var(--white);
`;

const LogoStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const LocationSelectBoxStyled = styled.div`
  position: relative;
  margin-left: 40px;
  font-size: 24px;
  font-family: var(--location-font);
  background: url(src/assets/images/select.svg) no-repeat 100% 50%;
  width: 80px;
  cursor: pointer;
`;

const MapButtonStyled = styled.div`
  cursor: pointer;
`;

export default TopNavContainer;
