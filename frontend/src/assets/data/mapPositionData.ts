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

export interface ISectionInfo {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  name: string;
  type: string;
}

export interface IFloorSectionsInfo {
  [index: string]: ISectionInfo[];
}

export const mapPostionData: IFloorSectionsInfo = {
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
