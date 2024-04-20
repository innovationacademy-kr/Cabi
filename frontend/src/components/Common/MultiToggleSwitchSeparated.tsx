import React from "react";
import styled from "styled-components";

export interface toggleItemSeparated {
  name: string;
  key: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface MultiToggleSwitchProps<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  toggleList: toggleItemSeparated[];
  buttonHeight?: string;
  buttonWidth?: string;
}

const MultiToggleSwitchSeparated = <T,>({
  setState,
  toggleList,
  buttonHeight,
  buttonWidth,
  state,
}: MultiToggleSwitchProps<T>) => {
  const switchToggle = (itemKey: string) => {
    if (state === itemKey) return;
    setState(itemKey as React.SetStateAction<T>);
  };

  return (
    <WrapperStyled>
      {toggleList.map((item) => {
        const ColorThemeIcon = item.icon;
        return (
          <ButtonStyled
            key={item.key}
            id={`${item.key}`}
            buttonHeight={buttonHeight}
            buttonWidth={buttonWidth}
            icon={ColorThemeIcon}
            isClicked={state === item.key}
            onClick={() => switchToggle(item.key)}
          >
            {ColorThemeIcon && <ColorThemeIcon />}
            {item.name}
          </ButtonStyled>
        );
      })}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;
`;

const ButtonStyled = styled.button<{
  buttonHeight?: string;
  buttonWidth?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isClicked: boolean;
}>`
  display: flex;
  justify-content: ${(props) => (props.icon ? "space-between" : "center")};
  align-items: center;
  flex-direction: ${(props) => (props.icon ? "column" : "row")};
  min-width: 50px;
  width: ${(props) => (props.buttonWidth ? props.buttonWidth : "fit-content")};
  min-width: 50px;
  border-radius: 10px;
  font-size: 1rem;
  height: ${(props) => (props.buttonHeight ? props.buttonHeight : "30px")};
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

export default MultiToggleSwitchSeparated;
