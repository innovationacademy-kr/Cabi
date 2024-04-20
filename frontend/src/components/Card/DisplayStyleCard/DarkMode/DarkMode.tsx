import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { darkModeState } from "@/recoil/atoms";
import MultiToggleSwitchSeparated, {
  toggleItemSeparated,
} from "@/components/Common/MultiToggleSwitchSeparated";
import { colorThemeToggleIconComponentMap } from "@/assets/data/maps";
import {
  ColorThemeToggleType,
  ColorThemeType,
} from "@/types/enum/colorTheme.type.enum";

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

const DarkMode = () => {
  const savedColorTheme = localStorage.getItem("color-theme");
  const savedColorThemeToggle = localStorage.getItem("color-theme-toggle");
  var darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<ColorThemeType>(
    savedColorTheme
      ? (savedColorTheme as ColorThemeType)
      : darkModeQuery.matches
      ? ColorThemeType.DARK
      : ColorThemeType.LIGHT
  );
  const [toggleType, setToggleType] = useState<ColorThemeToggleType>(
    savedColorThemeToggle
      ? (savedColorThemeToggle as ColorThemeToggleType)
      : ColorThemeToggleType.DEVICE
  );

  useEffect(() => {
    darkModeQuery.addEventListener("change", (event) =>
      setDarkMode(event.matches ? ColorThemeType.DARK : ColorThemeType.LIGHT)
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute("color-theme", darkMode);
    localStorage.setItem("color-theme", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("color-theme-toggle", toggleType);

    if (toggleType === ColorThemeToggleType.LIGHT) {
      setDarkMode(ColorThemeType.LIGHT);
    } else if (toggleType === ColorThemeToggleType.DARK) {
      setDarkMode(ColorThemeType.DARK);
    } else {
      setDarkMode(
        darkModeQuery.matches ? ColorThemeType.DARK : ColorThemeType.LIGHT
      );
    }
  }, [toggleType]);

  return (
    <>
      <ButtonsWrapperStyled>
        <MultiToggleSwitchSeparated
          state={toggleType}
          setState={setToggleType}
          toggleList={toggleList}
          buttonHeight={"90px"}
          buttonWidth={"90px"}
        ></MultiToggleSwitchSeparated>
      </ButtonsWrapperStyled>
    </>
  );
};

const ButtonsWrapperStyled = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px;
`;

export default DarkMode;
