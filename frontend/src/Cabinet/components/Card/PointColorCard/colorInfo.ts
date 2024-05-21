import ColorType from "@/Cabinet/types/enum/color.type.enum";

interface ColorData {
  title: string;
  type: string;
  getColor: (props: {
    mainColor: string;
    subColor: string;
    mineColor: string;
  }) => string;
}

export const pointColorData: ColorData[] = [
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
  "--custom-pink",
  "--custom-orange",
  "--custom-yellow",
  "--custom-green-100",
  "--custom-green-200",
  "--custom-blue-100",
  "--custom-blue-200",
  "--custom-blue-300",
  "--custom-purple-100",
  "--custom-purple-200",
];

export const GetCustomColorsValues = () => {
  return customColors.map((color) => {
    // NOTE : var(--custom-*)의 값 구하기
    return getComputedStyle(document.body).getPropertyValue(color);
  });
};
