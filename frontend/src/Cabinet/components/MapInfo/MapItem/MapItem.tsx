import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentFloorNumberState } from "@/Cabinet/recoil/atoms";
import { currentBuildingFloorState } from "@/Cabinet/recoil/selectors";
import { ISectionInfo } from "@/Cabinet/assets/data/mapPositionData";
import SectionType from "@/Cabinet/types/enum/map.type.enum";
import useMenu from "@/Cabinet/hooks/useMenu";

const MapItem: React.FC<{
  floor: number;
  info: ISectionInfo;
  selectSection: Function;
}> = ({ floor, info, selectSection }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCurrentFloor = useSetRecoilState(currentFloorNumberState);
  const floors = useRecoilValue<Array<number>>(currentBuildingFloorState);
  const { closeMap } = useMenu();

  const onClick = (info: ISectionInfo) => {
    if (info.type === "floorInfo") return;
    if (pathname !== "main") navigate("main");
    setCurrentFloor(floor ? floor : floors[0]);
    selectSection(info.name);
    closeMap();
  };

  const renderMapItem = () => {
    switch (info.type) {
      case SectionType.stairs:
        return <IconContainerStyled />;
      default:
        return <>{info.name}</>;
    }
  };

  return (
    <ItemStyled
      className="cabiButton"
      onClick={() => onClick(info)}
      info={info}
    >
      {renderMapItem()}
    </ItemStyled>
  );
};

const ItemStyled = styled.div<{
  onClick: Function;
  info: ISectionInfo;
}>`
  padding: 3px;
  font-size: ${({ info }) => (info.type === "floorInfo" ? "1.8rem" : "0.8rem")};
  cursor: ${({ info }) => (info.type === "floorInfo" ? "default" : "pointer")};
  color: ${({ info }) =>
    info.type === "floorInfo"
      ? "var(--line-color)"
      : "var(--white-text-with-bg-color)"};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  letter-spacing: -0.05rem;
  grid-column-start: ${({ info }) => info.colStart};
  grid-column-end: ${({ info }) => info.colEnd};
  grid-row-start: ${({ info }) => info.rowStart};
  grid-row-end: ${({ info }) => info.rowEnd};
  background: ${({ info }) =>
    info.type === "cabinet"
      ? "var(--sys-main-color)"
      : info.type === "floorInfo"
      ? "transparent"
      : "var(--line-color)"};
  &:hover {
    opacity: ${({ info }) => (info.type === "cabinet" ? 0.9 : 1)};
  }
`;

const IconContainerStyled = styled.div`
  width: 100%;
  height: 48px;
  background-image: url("/src/Cabinet/assets/images/stairs.svg");
  background-size: contain;
  background-repeat: no-repeat;
`;

export default MapItem;
