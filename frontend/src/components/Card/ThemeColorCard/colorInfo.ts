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
  "var(--custom-pink)",
  "var(--custom-orange)",
  "var(--custom-yellow)",
  "var(--custom-green-100)",
  "var(--custom-green-200)",
  "var(--custom-blue-100)",
  "var(--custom-blue-200)",
  "var(--custom-blue-300)",
  "var(--custom-purple-100)",
  "var(--custom-purple-200)",
];
