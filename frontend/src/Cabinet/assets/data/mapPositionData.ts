import SectionType from "@/Cabinet/types/enum/map.type.enum";

/**
 * @interface
 * @description 클러스터 사물함 위치 더미 데이터
 * @member {number} colStart : grid 가로 시작 위치 1부터 시작
 * @member {number} colEnd : grid 가로 마지막 위치
 * @member {number} rowStart : grid 세로 시작 위치 2부터 시작
 * @member {number} rowEnd : grid 세로 마지막 위치
 * @member {string} name : 사물함 이름 정보
 * @member {string} type : 사물함과 엘레베이터 타입 구분자
 */
export interface ISectionInfo {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
  name: string;
  type: SectionType;
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
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: SectionType.elevator,
    },
    {
      colStart: 5,
      colEnd: 6,
      rowStart: 4,
      rowEnd: 5,
      name: "Stairs",
      type: SectionType.stairs,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: "Cluster 1 - OA",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: `End of Cluster 1`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 5,
      rowEnd: 6,
      name: "Cluster 1 - Terrace1",
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 7,
      rowEnd: 9,
      name: "Cluster 1 - Terrace2",
      type: SectionType.cabinet,
    },
    {
      colStart: 3,
      colEnd: 4,
      rowStart: 4,
      rowEnd: 6,
      name: "2F",
      type: SectionType.floorInfo,
    },
  ],
  "3": [
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 8,
      rowEnd: 9,
      name: `E/V`,
      type: SectionType.elevator,
    },
    {
      colStart: 5,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: "Stairs",
      type: SectionType.stairs,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 7,
      rowEnd: 8,
      name: "Cluster X - 7",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: "Cluster X - 6",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 5,
      rowEnd: 6,
      name: "Cluster X - 5",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 4,
      rowEnd: 5,
      name: "Cluster X - 4",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 3,
      rowEnd: 4,
      name: "Cluster X - 3",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 2,
      rowEnd: 3,
      name: "Cluster X - 2",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 1,
      rowEnd: 2,
      name: "Cluster X - 1",
      type: SectionType.cabinet,
    },
    {
      colStart: 3,
      colEnd: 4,
      rowStart: 4,
      rowEnd: 6,
      name: "3F",
      type: SectionType.floorInfo,
    },
  ],
  "4": [
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 1,
      rowEnd: 2,
      name: `End of Cluster 4`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: SectionType.elevator,
    },
    {
      colStart: 5,
      colEnd: 6,
      rowStart: 4,
      rowEnd: 5,
      name: "Stairs",
      type: SectionType.stairs,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: `Cluster 3 - OA`,
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: `End of Cluster 3`,
      type: SectionType.cabinet,
    },
    {
      colStart: 3,
      colEnd: 4,
      rowStart: 4,
      rowEnd: 6,
      name: "4F",
      type: SectionType.floorInfo,
    },
  ],
  "5": [
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 1,
      rowEnd: 2,
      name: `End of Cluster 6`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 3,
      rowStart: 3,
      rowEnd: 4,
      name: `Oasis`,
      type: SectionType.cabinet,
    },
    {
      colStart: 1,
      colEnd: 2,
      rowStart: 4,
      rowEnd: 5,
      name: `E/V`,
      type: SectionType.elevator,
    },
    {
      colStart: 5,
      colEnd: 6,
      rowStart: 4,
      rowEnd: 5,
      name: "Stairs",
      type: SectionType.stairs,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 6,
      rowEnd: 7,
      name: "Cluster 5 - OA",
      type: SectionType.cabinet,
    },
    {
      colStart: 4,
      colEnd: 6,
      rowStart: 8,
      rowEnd: 9,
      name: "End of Cluster 5",
      type: SectionType.cabinet,
    },
    {
      colStart: 3,
      colEnd: 4,
      rowStart: 4,
      rowEnd: 6,
      name: "5F",
      type: SectionType.floorInfo,
    },
  ],
};
