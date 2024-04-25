import React from "react";
import styled from "styled-components";
import TopNavDomainGroup from "@/Cabinet/components/TopNav/TopNavDomainGroup/TopNavDomainGroup";
import { ReactComponent as LogoImg } from "@/Presentation/assets/images/logo.svg";

interface ITopNavProps {
  onClickLogo: React.MouseEventHandler<SVGSVGElement>;
  isAdmin?: boolean;
}

const TopNav = ({
  onClickLogo,
  isAdmin = false,
}: ITopNavProps): JSX.Element => {
  return (
    <TopNavContainerStyled>
      <TopNavDomainGroup isAdmin={isAdmin} />
      <TopNavWrapperStyled id="topNavWrap">
        <LogoStyled id="topNavLogo" className="cabiButton">
          <LogoDivStyled>
            <LogoImg
              className="cabiButton"
              onClick={onClickLogo}
              viewBox="0.8 0.8 16 16"
            />
          </LogoDivStyled>
          <BuildingSelectBoxStyled className="cabiButton">
            <div className="cabiButton">수요지식회</div>
          </BuildingSelectBoxStyled>
        </LogoStyled>
        {/* {isAdmin && <SearchBar />} */}
        {/* <TopNavButtonGroup isAdmin={isAdmin} /> */}
      </TopNavWrapperStyled>
    </TopNavContainerStyled>
  );
};

const TopNavContainerStyled = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 10;
`;

const TopNavWrapperStyled = styled.div`
  width: 100%;
  height: 80px;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #bcbcbc;
  padding: 0 28px;
  color: var(--gray-color);
`;

const LogoStyled = styled.div`
  display: flex;
  align-items: center;
`;

const LogoDivStyled = styled.div`
  width: 35px;
  height: 35px;
  cursor: pointer;
  svg {
    .logo_svg__currentPath {
      fill: var(--main-color);
    }
    width: 35px;
    height: 35px;
  }

  & > svg > path {
    transform: scale(1.08);
  }
`;

const BuildingSelectBoxStyled = styled.span`
  position: relative;
  margin-left: 40px;
  font-size: 1.5rem;
  font-family: var(--building-font);
  & > div {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }
  @media (hover: hover) and (pointer: fine) {
    & > div:hover {
      opacity: 0.9;
    }
  }
`;

export default TopNav;
