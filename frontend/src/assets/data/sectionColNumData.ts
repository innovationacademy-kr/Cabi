export interface ISectionColNum {
  section: string;
  colNum: number;
}

export interface IFloorSectionColNum {
  floor: number;
  sectionColNum: ISectionColNum[];
}

export interface ILocationColNum {
  location: string;
  floorColNum: IFloorSectionColNum[];
}

export const staticColNumData: ILocationColNum[] = [
  {
    location: "새롬관",
    floorColNum: [
      {
        floor: 2,
        sectionColNum: [
          {
            section: "End of Cluster 1",
            colNum: 4,
          },
          {
            section: "Cluster 1 - OA",
            colNum: 5,
          },
          {
            section: "Cluster 1 - Terrace1",
            colNum: 5,
          },
          {
            section: "Cluster 1 - Terrace2",
            colNum: 8,
          },
          {
            section: "Oasis",
            colNum: 13,
          },
          {
            section: "End of Cluster 2",
            colNum: 2,
          },
        ],
      },
      {
        floor: 3,
        sectionColNum: [
          {
            section: "Cluster X2 - Aisle1",
            colNum: 11,
          },
          {
            section: "Cluster X2 - Aisle2",
            colNum: 8,
          },
          {
            section: "Cluster X2 - Aisle3",
            colNum: 8,
          },
        ],
      },
      {
        floor: 4,
        sectionColNum: [
          {
            section: "End of Cluster 3",
            colNum: 4,
          },
          {
            section: "Cluster 3 - OA",
            colNum: 5,
          },
          {
            section: "Oasis",
            colNum: 13,
          },
          {
            section: "End of Cluster 4",
            colNum: 3,
          },
        ],
      },
      {
        floor: 5,
        sectionColNum: [
          {
            section: "End of Cluster 5",
            colNum: 4,
          },
          {
            section: "Cluster 5 - OA",
            colNum: 5,
          },
          {
            section: "Oasis",
            colNum: 13,
          },
          {
            section: "End of Cluster 6",
            colNum: 2,
          },
        ],
      },
    ],
  },
];
