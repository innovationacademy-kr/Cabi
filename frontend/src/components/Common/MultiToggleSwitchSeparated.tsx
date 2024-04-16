import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export interface toggleItem {
  name: string;
  key: number;
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
    <WrapperStyled
      ref={wrapperRef}
      onClick={switchToggle}
      buttonHeight={buttonHeight}
      buttonWidth={buttonWidth}
    >
      {toggleList.map((item) => (
        <button key={item.key} className={`${item.key}`}>
          {item.name}
        </button>
      ))}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{
  buttonHeight?: string;
  buttonWidth?: string;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;
  justify-content: space-between;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) =>
      props.buttonWidth ? props.buttonWidth : "fit-content"};
    min-width: 50px;
    border-radius: 10px;
    font-size: 0.9rem;
    height: ${(props) => (props.buttonHeight ? props.buttonHeight : "30px")};
    font-weight: 500;
    background-color: var(--shared-gray-color-100);
    color: var(--normal-text-color);
    padding: 4px 12px;
  }
`;

export default MultiToggleSwitchSeparated;
