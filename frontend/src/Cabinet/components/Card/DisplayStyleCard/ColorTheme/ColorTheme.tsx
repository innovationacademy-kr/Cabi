import { useRecoilState } from "recoil";
import styled from "styled-components";
import { darkModeState } from "@/Cabinet/recoil/atoms";
import { colorThemeToggleIconComponentMap } from "@/Cabinet/assets/data/maps";
import { ColorThemeToggleType } from "@/Cabinet/types/enum/colorTheme.type.enum";

interface toggleItemSeparated {
  name: string;
  key: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const toggleList: toggleItemSeparated[] = [
  {
    name: "라이트",
    key: ColorThemeToggleType.LIGHT,
    icon: colorThemeToggleIconComponentMap[ColorThemeToggleType.LIGHT],
  },
  {
    name: "다크",
    key: ColorThemeToggleType.DARK,
    icon: colorThemeToggleIconComponentMap[ColorThemeToggleType.DARK],
  },
  {
    name: "기기설정",
    key: ColorThemeToggleType.DEVICE,
    icon: colorThemeToggleIconComponentMap[ColorThemeToggleType.DEVICE],
  },
];

const ColorTheme = ({
  colorThemeToggle,
  handleColorThemeButtonClick,
}: {
  colorThemeToggle: ColorThemeToggleType;
  handleColorThemeButtonClick: (colorThemeToggleType: string) => void;
}) => {
  return (
    <>
      <ButtonsWrapperStyled>
        {toggleList.map((item) => {
          const ColorThemeIcon = item.icon;
          return (
            <ButtonStyled
              key={item.key}
              id={`${item.key}`}
              isClicked={colorThemeToggle === item.key}
              onClick={() => handleColorThemeButtonClick(item.key)}
            >
              {ColorThemeIcon && <ColorThemeIcon />}
              {item.name}
            </ButtonStyled>
          );
        })}
      </ButtonsWrapperStyled>
    </>
  );
};

const ButtonsWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
  padding: 0 16px;
`;

const ButtonStyled = styled.button<{
  isClicked: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  min-width: 50px;
  width: 90px;
  min-width: 50px;
  border-radius: 10px;
  font-size: 1rem;
  height: 90px;
  font-weight: 500;
  background-color: ${(props) =>
    props.isClicked ? "var(--sys-main-color)" : "var(--shared-gray-color-100)"};
  color: ${(props) =>
    props.isClicked
      ? "var(--white-text-with-bg-color)"
      : "var(--normal-text-color)"};
  padding: 12px 0 16px 0;

  & > svg {
    width: 30px;
    height: 30px;
  }

  & > svg > path {
    stroke: ${(props) =>
      props.isClicked
        ? "var(--white-text-with-bg-color)"
        : "var(--normal-text-color)"};
  }
`;

export default ColorTheme;
