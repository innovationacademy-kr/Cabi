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
  fontSize = "0.9rem",
}: MultiToggleSwitchProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      if (button.className === `${initialState}`) {
        button.style.color = "white";
        button.style.backgroundColor = "var(--main-color)";
      } else {
        button.style.color = "black";
        button.style.backgroundColor = "var(--white)";
      }
    });
  }, [initialState]);

  function switchToggle(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target === e.currentTarget) return;

    // setPage(0);
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      button.style.color = "black";
      button.style.backgroundColor = "var(--white)";
    });

    target.style.color = "white";
    target.style.backgroundColor = "var(--main-color)";

    setState(target.className as React.SetStateAction<T>);
  }

  return (
    <WrapperStyled ref={wrapperRef} onClick={switchToggle} fontSize={fontSize}>
      {toggleList.map((item) => (
        <button key={item.key} className={`${item.key}`}>
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
  align-items: center;
  border-radius: 10px;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: 50px;
    border-radius: 10px;
    font-size: ${(props) => props.fontSize};
    height: 40px;
    font-weight: 500;
    background-color: var(--lightgray-color);
    color: black;
    padding: 4px 12px;
    margin: 0px 4px;
  }
`;

export default MultiToggleSwitchSeparated;
