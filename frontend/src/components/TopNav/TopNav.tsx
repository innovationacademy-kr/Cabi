import React from "react";
import { SetterOrUpdater } from "recoil";
import styled from "styled-components";
import SearchBar from "@/components/TopNav/SearchBar/SearchBar";
import TopNavButtonGroup from "@/components/TopNav/TopNavButtonGroup/TopNavButtonGroup";
import useOutsideClick from "@/hooks/useOutsideClick";

interface IBuildingListItem {
  building: string;
  onUpdate: SetterOrUpdater<string>;
  onClose: React.Dispatch<boolean>;
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

const TopNav: React.FC<{
  currentBuildingName: string;
  buildingsList: Array<string>;
  buildingClicked: boolean;
  setBuildingClicked: React.Dispatch<boolean>;
  onClickLogo: React.MouseEventHandler<HTMLImageElement>;
  setCurrentBuildingName: SetterOrUpdater<string>;
  isAdmin?: boolean;
}> = (props) => {
  const {
    currentBuildingName,
    buildingsList,
    buildingClicked,
    setBuildingClicked,
    onClickLogo,
    setCurrentBuildingName,
    isAdmin,
  } = props;

  const buildingDom = React.useRef<HTMLElement>(null);
  useOutsideClick(buildingDom, () => {
    if (buildingClicked) setBuildingClicked(false);
  });

  return (
    <TopNavContainerStyled id="topNavWrap">
      <LogoStyled id="topNavLogo" className="cabiButton">
        <LogoDivStyled>
          <img
            className="cabiButton"
            onClick={onClickLogo}
            src="/src/assets/images/logo.svg"
            alt=""
          />
        </LogoDivStyled>
        <BuildingSelectBoxStyled ref={buildingDom} className="cabiButton">
          <div
            className="cabiButton"
            onClick={() => setBuildingClicked(!buildingClicked)}
          >
            {currentBuildingName}
          </div>
          <BuildingListStyled clicked={buildingClicked} className="cabiButton">
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
  align-items: center;
`;

const LogoDivStyled = styled.div`
  width: 35px;
  height: 35px;
  cursor: pointer;
`;

const BuildingSelectBoxStyled = styled.span`
  position: relative;
  margin-left: 40px;
  font-size: 24px;
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
  & > div::after {
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

const BuildingListStyled = styled.ul<{ clicked: boolean }>`
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
  user-select: none !important;
`;

const BuildingListItemStyled = styled.li`
  width: 80px;
  height: 40px;
  color: var(--black);
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

export default TopNav;
