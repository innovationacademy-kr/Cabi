import React, { useEffect, useRef } from "react";
import styled from "styled-components";

export interface toggleItem {
  name: string;
  key: string;
}

interface MultiToggleSwitchProps<T> {
  initialState: T; // 초기값
  setState: React.Dispatch<React.SetStateAction<T>>; // 상태를 변경하는 dispatcher
  toggleList: toggleItem[]; // 토글 리스트
}

const MultiToggleSwitch = <T,>({
  initialState,
  setState,
  toggleList,
}: MultiToggleSwitchProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      if (button.className === initialState) {
        button.style.color = "var(--white-text-with-bg-color)";
        button.style.backgroundColor = "var(--sys-main-color)";
      }
    });
  }, [initialState]);

  function switchToggle(e: any) {
    const target = e.target as HTMLButtonElement;

    if (target === e.currentTarget) return;

    const buttons = wrapperRef.current?.querySelectorAll("button");

    buttons?.forEach((button) => {
      button.style.color = "var(--normal-text-color)";
      button.style.backgroundColor = "transparent";
    });

    target.style.color = "var(--bg-color)";
    target.style.backgroundColor = "var(--sys-main-color)";

    setState(target.className as React.SetStateAction<T>);
  }

  return (
    <WrapperStyled ref={wrapperRef} onClick={switchToggle}>
      {toggleList.map((item) => (
        <button key={item.key} className={item.key}>
          {item.name}
        </button>
      ))}
    </WrapperStyled>
  );
};

const WrapperStyled = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  background-color: var(--card-bg-color);
  border-radius: 10px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    min-width: 50px;
    border-radius: 10px;
    font-size: 0.875rem;
    height: 30px;
    font-weight: 500;
    background-color: transparent;
    color: var(--normal-text-color);
    padding: 4px 12px;
  }
`;

export default MultiToggleSwitch;
