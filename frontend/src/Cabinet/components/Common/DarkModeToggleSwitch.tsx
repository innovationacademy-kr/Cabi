import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moonAdmin.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sunAdmin.svg";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

interface ToggleSwitchInterface {
  id: string;
}

const getInitialDisplayStyle = (
  savedDisplayStyleToggle: DisplayStyleToggleType,
  darkModeQuery: MediaQueryList
) => {
  if (savedDisplayStyleToggle === DisplayStyleToggleType.LIGHT)
    return DisplayStyleType.LIGHT;
  else if (savedDisplayStyleToggle === DisplayStyleToggleType.DARK)
    return DisplayStyleType.DARK;

  if (darkModeQuery.matches) {
    return DisplayStyleType.DARK;
  }
  return DisplayStyleType.LIGHT;
};

const DarkModeToggleSwitch = ({ id }: ToggleSwitchInterface) => {
  const savedDisplayStyleToggle =
    (localStorage.getItem("display-style-toggle") as DisplayStyleToggleType) ||
    DisplayStyleToggleType.DEVICE;
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const initialDisplayStyle = getInitialDisplayStyle(
    savedDisplayStyleToggle,
    darkModeQuery
  );
  const [darkMode, setDarkMode] = useState<DisplayStyleType>(
    initialDisplayStyle as DisplayStyleType
  );
  const [toggleType, setToggleType] = useState<DisplayStyleToggleType>(
    savedDisplayStyleToggle
  );

  const setColorsAndLocalStorage = (toggleType: DisplayStyleToggleType) => {
    setToggleType(toggleType);
    localStorage.setItem("display-style-toggle", toggleType);
    setDarkMode(
      toggleType === DisplayStyleToggleType.LIGHT
        ? DisplayStyleType.LIGHT
        : toggleType === DisplayStyleToggleType.DARK
        ? DisplayStyleType.DARK
        : darkModeQuery.matches
        ? DisplayStyleType.DARK
        : DisplayStyleType.LIGHT
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newToggleType =
      toggleType === DisplayStyleToggleType.LIGHT
        ? DisplayStyleToggleType.DARK
        : DisplayStyleToggleType.LIGHT;
    setColorsAndLocalStorage(newToggleType);
  };

  useEffect(() => {
    darkModeQuery.addEventListener("change", (event) =>
      setDarkMode(
        event.matches ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
      )
    );
  }, []);

  useEffect(() => {
    document.body.setAttribute("display-style", darkMode);
  }, [darkMode]);

  return (
    <ToggleSwitchContainerStyled>
      <InputStyled
        type="checkbox"
        id={id}
        checked={darkMode === DisplayStyleType.DARK}
        onChange={handleChange}
      />
      <ToggleSwitchStyled
        htmlFor={id}
        checked={darkMode === DisplayStyleType.DARK}
      >
        <SunWrapperStyled>
          <SunIcon />
        </SunWrapperStyled>
        <MoonWrapperStyled>
          <MoonIcon />
        </MoonWrapperStyled>
        <ToggleKnobStyled checked={darkMode === DisplayStyleType.DARK} />
      </ToggleSwitchStyled>
    </ToggleSwitchContainerStyled>
  );
};

const ToggleSwitchContainerStyled = styled.div`
  display: inline-block;
  position: relative;
  margin-right: 10px;
`;

const InputStyled = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
`;

const ToggleSwitchStyled = styled.label<{ checked: boolean }>`
  cursor: pointer;
  display: inline-block;
  position: relative;
  background: ${(props) =>
    props.checked ? "var(--sys-main-color)" : "var(--line-color)"};
  width: 46px;
  height: 24px;
  border-radius: 50px;
  transition: background-color 0.2s ease;
`;

const ToggleKnobStyled = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${(props) => (props.checked ? "calc(100% - 21px)" : "3px")};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--white-text-with-bg-color);
  transition: left 0.2s;
`;

const SunWrapperStyled = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const MoonWrapperStyled = styled.div`
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;

  & > svg {
    width: 100%;
    height: 100%;
    fill: var(--ref-gray-900);
  }
`;

export default DarkModeToggleSwitch;
