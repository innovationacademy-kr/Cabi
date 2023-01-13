import {
  currentFloorNumberState,
  currentSectionNameState,
  isCurrentSectionRenderState,
} from "@/recoil/atoms";
import { currentLocationFloorState } from "@/recoil/selectors";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import useDetailInfo from "@/hooks/useDetailInfo";
import { ISectionInfo, mapPostionData } from "@/assets/data/mapPositionData";

const MapGrid = ({ floor }: { floor: number }) => {
  const setSection = useSetRecoilState(currentSectionNameState);
  const setIsCurrentSectionRender = useSetRecoilState(
    isCurrentSectionRenderState
  );

  const selectSection = (section: string) => {
    setIsCurrentSectionRender(true);
    setSection(section);
  };
  return (
    <MapGridStyled>
      {floor &&
        mapPostionData[floor].map((value: any, idx: any) => (
          <MapItem
            key={idx}
            floor={floor}
            info={value}
            selectSection={selectSection}
          />
        ))}
    </MapGridStyled>
  );
};

const MapItem: React.FC<{
  floor: number;
  info: ISectionInfo;
  selectSection: Function;
}> = ({ floor, info, selectSection }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCurrentFloor = useSetRecoilState(currentFloorNumberState);
  const floors = useRecoilValue<Array<number>>(currentLocationFloorState);
  const { closeMap } = useDetailInfo();
  const onClick = () => {
    if (pathname === "/home") navigate("/main");
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

const MapGridStyled = styled.div`
  width: 100%;
  max-height: 580px;
  height: 100%;
  background: #e7e7e7;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0px;
  border-radius: 10px;
`;

export default MapGrid;
