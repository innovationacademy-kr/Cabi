import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentFloorNumberState } from "@/recoil/atoms";
import { currentBuildingFloorState } from "@/recoil/selectors";
import { ISectionInfo } from "@/assets/data/mapPositionData";
import useMenu from "@/hooks/useMenu";

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
  const onClick = () => {
    if (pathname !== "main") navigate("main");
    setCurrentFloor(floor ? floor : floors[0]);
    selectSection(info.name);
    closeMap();
  };
  return (
    <ItemStyled className="cabiButton" onClick={onClick} info={info}>
      {info.name}
    </ItemStyled>
  );
};

const ItemStyled = styled.div<{
  onClick: React.MouseEventHandler;
  info: ISectionInfo;
}>`
  padding: 3px;
  font-size: ${({ info }) => (info.type === "floorInfo" ? "1.8rem" : "0.8rem")};
  cursor: pointer;
  color: ${({ info }) => (info.type === "floorInfo" ? "#bcb9b9" : "white")};
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
      ? "#9747ff"
      : info.type === "floorInfo"
      ? "transparent"
      : "#bcb9b9"};
  &:hover {
    opacity: ${({ info }) => (info.type === "cabinet" ? 0.9 : 1)};
  }
`;

export default MapItem;
