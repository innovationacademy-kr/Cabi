import React, { useEffect } from "react";
import styled from "styled-components";
import CabinetType from "@/types/enum/cabinet.type.enum";

interface MultiToggleSwitchProps {
  cabinetType: CabinetType;
  onChange: (CabinetType: CabinetType) => void;
}

const MultiToggleSwitch: React.FC<MultiToggleSwitchProps> = ({
  cabinetType,
  onChange,
}) => {
  useEffect(() => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      if (button.className === cabinetType) {
        button.style.color = "white";
        button.style.backgroundColor = "var(--main-color)";
      }
    });
  }, []);

  function changeTargetButton(e: any) {
    const target = e.target;
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      button.style.color = "black";
      button.style.backgroundColor = "transparent";
    });

    target.style.color = "white";
    target.style.backgroundColor = "var(--main-color)";

    onChange(target.className);
  }

  return (
    <WrapperStyled onClick={changeTargetButton}>
      <button className={CabinetType.ALL}>전체</button>
      <button className={CabinetType.PRIVATE}>개인</button>
      <button className={CabinetType.SHARE}>공유</button>
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
    border-radius: 10px;
    font-size: 0.9rem;
    height: 30px;
    width: 50px;
    font-weight: 500;
    background-color: transparent;
    color: black;
  }
`;

export default MultiToggleSwitch;
