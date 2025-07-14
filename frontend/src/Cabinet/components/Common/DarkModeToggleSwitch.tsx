import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { displayStyleState } from "@/Cabinet/recoil/atoms";
import { getInitialDisplayStyle } from "@/Cabinet/components/Card/DisplayStyleCard/DisplayStyleCard.container";
import { ReactComponent as MoonIcon } from "@/Cabinet/assets/images/moonIcon.svg";
import { ReactComponent as SunIcon } from "@/Cabinet/assets/images/sunIcon.svg";
import {
  DisplayStyleToggleType,
  DisplayStyleType,
} from "@/Cabinet/types/enum/displayStyle.type.enum";
import useDisplayStyleToggle from "@/Cabinet/hooks/useDisplayStyleToggle";
import {
  getDisplayStyleFromLocalStorage,
  isDeviceDarkMode,
  updateBodyDisplayStyle,
} from "@/Cabinet/utils/displayStyleUtils";

const DarkModeToggleSwitch = ({ id }: { id: string }) => {
  const [toggleType, setToggleType] = useRecoilState(displayStyleState);
  const darkModeQuery = isDeviceDarkMode();
  const [displayStyleType, setDisplayStyleType] = useState<DisplayStyleType>(
    () => {
      return getInitialDisplayStyle(
        getDisplayStyleFromLocalStorage(),
        darkModeQuery
      );
    }
  );

  const isDarkMode = displayStyleType === DisplayStyleType.DARK;
  const { updateToggleType, addDarkModeListener } = useDisplayStyleToggle();

  useEffect(() => {
    setToggleType(getDisplayStyleFromLocalStorage());
  }, []);

  useEffect(() => {
    const updateDisplayStyleType = () => {
      const newDisplayStyleType = getInitialDisplayStyle(
        toggleType,
        darkModeQuery
      );
      setDisplayStyleType(newDisplayStyleType);
    };

    updateDisplayStyleType();
    const removeListener = addDarkModeListener(
      darkModeQuery,
      updateDisplayStyleType
    );
    return removeListener;
  }, [toggleType]);

  useEffect(() => {
    updateBodyDisplayStyle(displayStyleType);
  }, [displayStyleType]);

  const handleToggleChange = useCallback(() => {
    let newToggleType;
    if (toggleType === DisplayStyleToggleType.DEVICE) {
      newToggleType =
        displayStyleType === DisplayStyleType.LIGHT
          ? DisplayStyleToggleType.DARK
          : DisplayStyleToggleType.LIGHT;
    } else {
      newToggleType =
        toggleType === DisplayStyleToggleType.LIGHT
          ? DisplayStyleToggleType.DARK
          : DisplayStyleToggleType.LIGHT;
    }

    updateToggleType(newToggleType);
  }, [displayStyleType]);

  return (
    <ToggleWrapperStyled>
      <CheckboxStyled
        id={id}
        checked={isDarkMode}
        onChange={handleToggleChange}
      />
      <ToggleSwitchStyled htmlFor={id} isChecked={isDarkMode}>
        <MoonIconWrapperStyled>
          <MoonIcon />
        </MoonIconWrapperStyled>
        <SunIconWrapperStyled>
          <SunIcon />
        </SunIconWrapperStyled>
        <ToggleKnobStyled isChecked={isDarkMode} />
      </ToggleSwitchStyled>
    </ToggleWrapperStyled>
  );
};

const ToggleWrapperStyled = styled.div`
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

const MoonIconWrapperStyled = styled.div`
  position: absolute;
  left: 5px;
  top: 45%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;

  & > svg {
    width: 100%;
    height: 100%;
    fill: var(--ref-gray-900);
  }
`;

const SunIconWrapperStyled = styled.div`
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
