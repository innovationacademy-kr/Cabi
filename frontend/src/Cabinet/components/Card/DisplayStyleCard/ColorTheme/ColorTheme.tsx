import styled from "styled-components";
import { ReactComponent as MonitorMobileIcon } from "@/Cabinet/assets/images/monitorMobile.svg";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moon.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sun.svg";
import { ColorThemeToggleType } from "@/Cabinet/types/enum/colorTheme.type.enum";

interface ItoggleItemSeparated {
  name: string;
  key: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const toggleList: ItoggleItemSeparated[] = [
  {
    name: "라이트",
    key: ColorThemeToggleType.LIGHT,
    icon: SunIcon,
  },
  {
    name: "다크",
    key: ColorThemeToggleType.DARK,
    icon: MoonIcon,
  },
  {
    name: "기기설정",
    key: ColorThemeToggleType.DEVICE,
    icon: MonitorMobileIcon,
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
    props.isClicked ? "var(--sys-main-color)" : "var(--card-bg-color)"};
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
