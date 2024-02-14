import ColorType from "@/types/enum/color.type.enum";

interface ColorData {
  title: string;
  type: string;
  getColor: (props: {
    mainColor: string;
    subColor: string;
    mineColor: string;
  }) => string;
}

export const themeColorData: ColorData[] = [
  {
    title: "메인 컬러",
    type: ColorType.MAIN,
    getColor: (props) => props.mainColor,
  },
  {
    title: "서브 컬러",
    type: ColorType.SUB,
    getColor: (props) => props.subColor,
  },
  {
    title: "내 사물함",
    type: ColorType.MINE,
    getColor: (props) => props.mineColor,
  },
];

export const customColors = [
  "#FF4589",
  "#FF8B5B",
  "#FFC74C",
  "#00cec9",
  "#00C2AB",
  "#74b9ff",
  "#0984e3",
  "#0D4C92",
  "var(--custom-purple-100)",
  "#9747ff",
  // "var(--main-color)",
  // TODO : main color 말고 primary를 쓰기
];
