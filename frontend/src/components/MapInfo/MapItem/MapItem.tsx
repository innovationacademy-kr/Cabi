import React from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentLocationFloorState } from "@/recoil/selectors";
import { currentFloorNumberState } from "@/recoil/atoms";
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
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const { closeMap } = useMenu();
  const onClick = () => {
    if (pathname !== "/main") navigate("/main");
    setCurrentFloor(floor ? floor : floors[0]);
    selectSection(info.name);
    closeMap();
  };
  return (
    <ItemStyled onClick={onClick} info={info}>
      {info.name}
    </ItemStyled>
  );
};

const ItemStyled = styled.div<{
  onClick: React.MouseEventHandler;
  info: ISectionInfo;
}>`
  padding: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  color: white;
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
    info.type === "cabinet" ? "#9747ff" : "#bcb9b9"};
  &:hover {
    opacity: ${({ info }) => (info.type === "cabinet" ? 0.9 : 1)};
  }
`;

export default MapItem;
