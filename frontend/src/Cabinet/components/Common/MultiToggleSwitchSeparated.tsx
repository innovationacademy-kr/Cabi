import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export interface toggleItem {
  name: string;
  key: string;
}

interface MultiToggleSwitchProps<T> {
  initialState: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  toggleList: toggleItem[];
  fontSize?: string;
}

const MultiToggleSwitchSeparated = <T,>({
  initialState,
  setState,
  toggleList,
  fontSize = "0.875rem",
}: MultiToggleSwitchProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      if (button.classList.contains(`${initialState}`)) {
        button.classList.add("selected");
      } else {
        button.classList.add("categoryButton");
      }
    });
  }, [initialState]);

  function switchToggle(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target === e.currentTarget) return;

    // setPage(0);
    const selectedKey = target.className.split(" ")[0];
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      button.classList.remove("selected");
    });
    target.classList.add("selected");
    setState(selectedKey as React.SetStateAction<T>);
  }

  return (
    <WrapperStyled ref={wrapperRef} onClick={switchToggle} fontSize={fontSize}>
      {toggleList.map((item) => (
        <button key={item.key} className={`${item.key} categoryButton`}>
          {item.name}
        </button>
      ))}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div<{
  fontSize: string;
}>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(16.66% - 10px);
    height: 36px;
    min-width: 40px;
    border-radius: 10px;
    font-size: ${(props) => props.fontSize};
    font-weight: 500;
    padding: 4px 12px;
    box-sizing: border-box;
  }

  @media (max-width: 560px) {
    button {
      width: calc(33.333% - 10px);
    }
  }

  button.categoryButton {
    color: var(--normal-text-color);
    background-color: var(--card-content-bg-color);
  }

  button.selected {
    color: var(--white-text-with-bg-color);
    background-color: var(--sys-main-color);
    /* background-color: var(--sys-presentation-main-color); */
  }
`;

export default MultiToggleSwitchSeparated;
