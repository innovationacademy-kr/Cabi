import React from "react";
import { SetterOrUpdater } from "recoil";
import styled from "styled-components";
import SearchBar from "@/Cabinet/components/TopNav/SearchBar/SearchBar";
import TopNavButtonGroup from "@/Cabinet/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
import TopNavDomainGroup from "@/Cabinet/components/TopNav/TopNavDomainGroup/TopNavDomainGroup";
import { ReactComponent as LogoImg } from "@/Cabinet/assets/images/logo.svg";
import { ReactComponent as SelectIcon } from "@/Cabinet/assets/images/select.svg";
import useOutsideClick from "@/Cabinet/hooks/useOutsideClick";

interface IBuildingListItem {
  building: string;
  onUpdate: SetterOrUpdater<string>;
  onClose: React.Dispatch<boolean>;
}

interface ITopNavProps {
  currentBuildingName: string;
  buildingsList: Array<string>;
  buildingClicked: boolean;
  setBuildingClicked: React.Dispatch<boolean>;
  onClickLogo: React.MouseEventHandler<SVGSVGElement>;
  setCurrentBuildingName: SetterOrUpdater<string>;
  isAdmin?: boolean;
}

const BuildingListItem: React.FC<IBuildingListItem> = ({
  building,
  onUpdate,
  onClose,
}) => {
  return (
    <BuildingListItemStyled
      className="cabiButton"
      onClick={() => {
        onUpdate(building);
        onClose(false);
      }}
    >
      {building}
    </BuildingListItemStyled>
  );
};

const TopNav = ({
  currentBuildingName,
  buildingsList,
  buildingClicked,
  setBuildingClicked,
  onClickLogo,
  setCurrentBuildingName,
  isAdmin = false,
}: ITopNavProps): JSX.Element => {
  const buildingDom = React.useRef<HTMLElement>(null);
  useOutsideClick(buildingDom, () => {
    if (buildingClicked) setBuildingClicked(false);
  });

  return (
    <TopNavContainerStyled>
      <TopNavDomainGroup isAdmin={isAdmin} />
      <TopNavWrapperStyled id="topNavWrap">
        <LogoStyled id="topNavLogo" className="cabiButton">
          <LogoDivStyled>
            <LogoImg className="cabiButton" onClick={onClickLogo} />
          </LogoDivStyled>
          <BuildingSelectBoxStyled ref={buildingDom} className="cabiButton">
            <div
              className="cabiButton"
              onClick={() => setBuildingClicked(!buildingClicked)}
            >
              {currentBuildingName}
            </div>
            <BuildingListStyled
              clicked={buildingClicked}
              className="cabiButton"
            >
              {buildingsList.map((building, index) => (
                <BuildingListItem
                  building={building}
                  key={index}
                  onUpdate={setCurrentBuildingName}
                  onClose={setBuildingClicked}
                />
              ))}
            </BuildingListStyled>
          </BuildingSelectBoxStyled>
        </LogoStyled>
        {isAdmin && <SearchBar />}
        <TopNavButtonGroup isAdmin={isAdmin} />
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
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--line-color);
  padding: 0 28px;
  color: var(--shared-gray-color-500);
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
  }
`;

const BuildingSelectBoxStyled = styled.span`
  position: relative;
  margin-left: 40px;
  font-size: 1.5rem;
  font-family: var(--building-font);
  cursor: pointer;
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

const BuildingListStyled = styled.ul<{ clicked: boolean }>`
  position: absolute;
  top: 30px;
  left: -15px;
  padding: 5px 10px;
  background: var(--bg-color);
  opacity: 0.9;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 var(--border-shadow-color-200);
  z-index: 100;
  display: ${(props) => (props.clicked ? "block" : "none")};
  user-select: none !important;
`;

const BuildingListItemStyled = styled.li`
  width: 80px;
  height: 40px;
  color: var(--normal-text-color);
  font-size: 1.25rem;
  font-family: var(--main-font);
  line-height: 40px;
  text-indent: 5px;
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const SelectIconStyled = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;

  & > svg > path {
    stroke: var(--shared-gray-color-500);
  }
`;

export default TopNav;
