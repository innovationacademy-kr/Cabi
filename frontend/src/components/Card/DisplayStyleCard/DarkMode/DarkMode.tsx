import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { darkModeState } from "@/recoil/atoms";
import { colorThemeToggleIconComponentMap } from "@/assets/data/maps";
import { ColorThemeToggleType } from "@/types/enum/colorTheme.type.enum";

// TODO : DarkMode 파일 폴더명 ColorTheme으로 변경

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

export interface toggleItemSeparated {
  name: string;
  key: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const DarkMode = ({
  colorThemeToggle,
  handleColorThemeButtonClick,
}: {
  colorThemeToggle: ColorThemeToggleType;
  handleColorThemeButtonClick: (colorThemeToggleType: string) => void;
}) => {
  return (
    <>
      <ButtonsWrapperStyled>
        <WrapperStyled>
          {toggleList.map((item) => {
            const ColorThemeIcon = item.icon;
            return (
              <ButtonStyled
                key={item.key}
                id={`${item.key}`}
                icon={ColorThemeIcon}
                isClicked={colorThemeToggle === item.key}
                onClick={() => handleColorThemeButtonClick(item.key)}
              >
                {ColorThemeIcon && <ColorThemeIcon />}
                {item.name}
              </ButtonStyled>
            );
          })}
        </WrapperStyled>
      </ButtonsWrapperStyled>
    </>
  );
};

const ButtonsWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
`;

const ButtonStyled = styled.button<{
  buttonWidth?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isClicked: boolean;
}>`
  display: flex;
  justify-content: ${(props) => (props.icon ? "space-between" : "center")};
  align-items: center;
  flex-direction: ${(props) => (props.icon ? "column" : "row")};
  min-width: 50px;
  width: 90px;
  min-width: 50px;
  border-radius: 10px;
  font-size: 1rem;
  height: 90px;
  font-weight: 500;
  background-color: ${(props) =>
    props.isClicked ? "var(--main-color)" : "var(--shared-gray-color-100)"};
  color: ${(props) =>
    props.isClicked ? "var(--text-with-bg-color)" : "var(--normal-text-color)"};
  padding: ${(props) => (props.icon ? "12px 0 16px 0" : "4px 12px")};

  & > svg {
    width: 30px;
    height: 30px;
  }

  & > svg > path {
    stroke: ${(props) =>
      props.isClicked
        ? "var(--text-with-bg-color)"
        : "var(--normal-text-color)"};
  }
`;

export default DarkMode;
