import React, { useEffect } from "react";
import styled from "styled-components";

interface toggleItem {
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
  useEffect(() => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      if (button.className === initialState) {
        button.style.color = "white";
        button.style.backgroundColor = "var(--main-color)";
      }
    });
  }, []);

  function switchToggle(e: any) {
    const target = e.target;

    if (target === e.currentTarget) return;

    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      button.style.color = "black";
      button.style.backgroundColor = "transparent";
    });

    target.style.color = "white";
    target.style.backgroundColor = "var(--main-color)";

    setState(target.className);
  }

  return (
    <WrapperStyled onClick={switchToggle}>
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
  background-color: var(--lightgray-color);

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
    background-color: transparent;
    color: black;
  }
`;

export default MultiToggleSwitch;
