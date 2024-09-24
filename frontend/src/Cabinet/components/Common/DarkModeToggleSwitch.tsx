import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moonAdmin.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sunAdmin.svg";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

const DarkModeToggleSwitch = ({ id }: { id: string }) => {
  const [displayStyleToggle, setDisplayStyleToggle] =
    useRecoilState(displayStyleState);
  const [displayStyleType, setDisplayStyleType] = useState<DisplayStyleType>(
    DisplayStyleType.LIGHT
  );

  useEffect(() => {
    const savedToggleType =
      (localStorage.getItem(
        "display-style-toggle"
      ) as DisplayStyleToggleType) || DisplayStyleToggleType.DEVICE;
    setDisplayStyleToggle(savedToggleType);
  }, [setDisplayStyleToggle]);

  useEffect(() => {
    const updateDisplayStyleType = () => {
      if (displayStyleToggle === DisplayStyleToggleType.LIGHT) {
        setDisplayStyleType(DisplayStyleType.LIGHT);
      } else if (displayStyleToggle === DisplayStyleToggleType.DARK) {
        setDisplayStyleType(DisplayStyleType.DARK);
      } else {
        const isSystemDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDisplayStyleType(
          isSystemDarkMode ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
        );
      }
    };
    updateDisplayStyleType();

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (displayStyleToggle === DisplayStyleToggleType.DEVICE) {
        setDisplayStyleType(
          event.matches ? DisplayStyleType.DARK : DisplayStyleType.LIGHT
        );
      }
    };
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
      darkModeQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        darkModeQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [displayStyleToggle]);

  useEffect(() => {
    document.body.setAttribute("display-style", displayStyleType);
  }, [displayStyleType]);

  const handleToggle = () => {
    const newToggleType =
      displayStyleToggle === DisplayStyleToggleType.LIGHT
        ? DisplayStyleToggleType.DARK
        : DisplayStyleToggleType.LIGHT;
    localStorage.setItem("display-style-toggle", newToggleType);
    setDisplayStyleToggle(newToggleType);
  };

  const isDarkMode = displayStyleType === DisplayStyleType.DARK;

  return (
    <ToggleSwitchContainer>
      <CheckboxStyled id={id} checked={isDarkMode} onChange={handleToggle} />
      <ToggleSwitchStyled htmlFor={id} isChecked={isDarkMode}>
        <MoonIconWrapper>
          <MoonIcon />
        </MoonIconWrapper>
        <SunIconWrapper>
          <SunIcon />
        </SunIconWrapper>
        <ToggleKnobStyled isChecked={isDarkMode} />
      </ToggleSwitchStyled>
    </ToggleSwitchContainer>
  );
};

const ToggleSwitchContainer = styled.div`
  display: inline-block;
  position: relative;
  margin-right: 10px;
`;

const CheckboxStyled = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
`;

const ToggleSwitchStyled = styled.label<{ isChecked: boolean }>`
  cursor: pointer;
  display: inline-block;
  position: relative;
  background: ${(props) =>
    props.isChecked ? "var(--sys-main-color)" : "var(--line-color)"};
  width: 46px;
  height: 24px;
  border-radius: 50px;
  transition: background-color 0.2s ease;
`;

const ToggleKnobStyled = styled.span<{ isChecked: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${(props) => (props.isChecked ? "calc(100% - 21px)" : "3px")};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--white-text-with-bg-color);
  transition: left 0.2s;
`;

const MoonIconWrapper = styled.div`
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

const SunIconWrapper = styled.div`
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

export default DarkModeToggleSwitch;
