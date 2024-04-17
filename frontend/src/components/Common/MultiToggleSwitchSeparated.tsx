import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export interface toggleItem {
  name: string;
  key: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface MultiToggleSwitchProps<T> {
  initialState: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  toggleList: toggleItem[];
  buttonHeight?: string;
  buttonWidth?: string;
}

const MultiToggleSwitchSeparated = <T,>({
  initialState,
  setState,
  toggleList,
  buttonHeight,
  buttonWidth,
}: MultiToggleSwitchProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      if (button.className === `${initialState}`) {
        button.style.color = "var(--bg-color)";
        button.style.backgroundColor = "var(--main-color)";
      }
    });
  }, [initialState]);

  function switchToggle(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target === e.currentTarget) return;

    // setPage(0);
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      button.style.color = "var(--normal-text-color)";
      button.style.backgroundColor = "var(--shared-gray-color-100)";
    });

    target.style.color = "var(--bg-color)";
    target.style.backgroundColor = "var(--main-color)";

    setState(target.className as React.SetStateAction<T>);
  }

  return (
    <WrapperStyled ref={wrapperRef} onClick={switchToggle}>
      {toggleList.map((item) => {
        const ColorThemeIcon = item.icon;
        return (
          <ButtonStyled
            key={item.key}
            className={`${item.key}`}
            buttonHeight={buttonHeight}
            buttonWidth={buttonWidth}
            icon={ColorThemeIcon}
          >
            {ColorThemeIcon && (
              <ColorThemeIconStyled>
                <ColorThemeIcon />
              </ColorThemeIconStyled>
            )}
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

const ButtonStyled = styled.div<{
  buttonHeight?: string;
  buttonWidth?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
  background-color: var(--shared-gray-color-100);
  color: var(--normal-text-color);
  padding: ${(props) => (props.icon ? "12px 0 16px 0" : "4px 12px")}; ;
`;

const ColorThemeIconStyled = styled.div``;

export default MultiToggleSwitchSeparated;
