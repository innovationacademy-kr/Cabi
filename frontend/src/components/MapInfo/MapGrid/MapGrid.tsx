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

/*
    클러스터 사물함 위치 더미 데이터
    grid col : 가로 , grid row : 세로

    colStart : grid 가로 시작 위치 1부터 시작
    colEnd   : grid 가로 마지막 위치
    rowStart : grid 세로 시작 위치 2부터 시작
    rowEnd   : grid 세로 마지막 위치
    name     : 사물함 이름 정보
    type     : 사물함과 엘레베이터 타입 구분자
*/

interface IFloorSectionInfo {
  [index: string]: IFloorMapInfo[];
}
const data: IFloorSectionInfo = {
  "2": [
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 1,
      rowEnd: 2,
      name: "End of Cluster 2",
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: "elevator",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: "Cluster 1 - OA",
      type: "cabinet",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: `End of Cluster 1`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 6,
      rowEnd: 9,
      name: "Cluster 1 - Terrace",
      type: "cabinet",
    },
  ],
  "4": [
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 1,
      rowEnd: 2,
      name: `End of Cluster 4`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: "elevator",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: `Cluster 3 - OA`,
      type: "cabinet",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: `End of Cluster 3`,
      type: "cabinet",
    },
  ],
  "5": [
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 1,
      rowEnd: 2,
      name: `End of Cluster 6`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: "cabinet",
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: "elevator",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: "Cluster 5 - OA",
      type: "cabinet",
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: "End of Cluster 5",
      type: "cabinet",
    },
  ],
};

interface IFloorMapInfo {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  name: string;
  type: string;
}

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
        data[floor].map((value: any, idx: any) => (
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
  info: IFloorMapInfo;
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
  info: IFloorMapInfo;
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
