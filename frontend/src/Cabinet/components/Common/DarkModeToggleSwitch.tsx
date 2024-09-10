import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moonAdmin.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sunAdmin.svg";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";

interface ToggleSwitchInterface {
  id: string;
}

const DarkModeToggleSwitch = ({ id }: ToggleSwitchInterface) => {
  const [displayStyleToggle, setDisplayStyleToggle] =
    useRecoilState(displayStyleState);
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  useEffect(() => {
    const savedDisplayStyle =
      localStorage.getItem("display-style-toggle") ||
      DisplayStyleToggleType.DEVICE;
    setDisplayStyleToggle(savedDisplayStyle as DisplayStyleToggleType);
  }, []);

  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent) => {
      if (displayStyleToggle === DisplayStyleToggleType.DEVICE) {
        const newDisplayStyle = event.matches
          ? DisplayStyleType.DARK
          : DisplayStyleType.LIGHT;
        setDisplayStyleToggle(
          newDisplayStyle === DisplayStyleType.DARK
            ? DisplayStyleToggleType.DARK
            : DisplayStyleToggleType.LIGHT
        );
      }
    };
    document.body.setAttribute("display-style", displayStyleToggle);
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, [darkModeQuery, displayStyleToggle]);

  const handleToggle = () => {
    const newToggleType =
      displayStyleToggle === DisplayStyleToggleType.LIGHT
        ? DisplayStyleToggleType.DARK
        : DisplayStyleToggleType.LIGHT;
    localStorage.setItem("display-style-toggle", newToggleType);
    setDisplayStyleToggle(newToggleType);
  };

  const isChecked =
    displayStyleToggle === DisplayStyleToggleType.DARK ||
    (displayStyleToggle === DisplayStyleToggleType.DEVICE &&
      darkModeQuery.matches);

  return (
    <ToggleSwitchContainerStyled>
      <InputStyled
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleToggle}
      />
      <ToggleSwitchStyled htmlFor={id} checked={isChecked}>
        <SunWrapperStyled>
          <SunIcon />
        </SunWrapperStyled>
        <MoonWrapperStyled>
          <MoonIcon />
        </MoonWrapperStyled>
        <ToggleKnobStyled checked={isChecked} />
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
