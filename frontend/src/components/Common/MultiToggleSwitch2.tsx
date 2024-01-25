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
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const MultiToggleSwitch2 = <T,>({
  initialState,
  setState,
  toggleList,
  setPage,
}: MultiToggleSwitchProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      if (button.className === initialState) {
        button.style.color = "white";
        button.style.backgroundColor = "var(--main-color)";
      }
    });
  }, [initialState]);

  function switchToggle(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target === e.currentTarget) return;

    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      button.style.color = "black";
      button.style.backgroundColor = "var(--lightgray-color)";
    });

    target.style.color = "white";
    target.style.backgroundColor = "var(--main-color)";

    setState(target.className as React.SetStateAction<T>);
  }

  return (
    <WrapperStyled ref={wrapperRef} onClick={switchToggle}>
      {toggleList.map((item, idx) => (
        <button key={item.key} className={item.key}>
          {item.name}
        </button>
      ))}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 10px;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    min-width: 50px;
    border-radius: 10px;
    font-size: 0.9rem;
    height: 30px;
    font-weight: 500;
    background-color: var(--lightgray-color);
    color: black;
    padding: 4px 12px;
    margin: 0px 4px;
  }
`;

export default MultiToggleSwitch2;
