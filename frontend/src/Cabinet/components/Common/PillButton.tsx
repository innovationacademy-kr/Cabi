import { useState } from "react";
import styled from "styled-components";

interface IPillButtonProps {
  text: string;
  theme: string;
  onClickButton(event: React.MouseEvent<HTMLButtonElement>): void;
}

const PillButton = ({ text, theme, onClickButton }: IPillButtonProps) => {
  const [isSelected, setIsSelected] = useState(theme === "line" ? false : true);
  const toggleSelect = () => {
    setIsSelected(!isSelected);
  };
  return (
    <PillButtonContainerStyled
      isSelected={isSelected}
      onClick={(e) => {
        onClickButton(e);
        toggleSelect();
      }}
    >
      {text}
    </PillButtonContainerStyled>
  );
};

const PillButtonContainerStyled = styled.button<{
  isSelected: boolean;
}>`
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--sys-main-color)" : "transparent"};
  border: ${({ isSelected }) =>
    isSelected
      ? "1px solid var(--sys-main-color)"
      : "1px solid var(--line-color)"};
  color: ${({ isSelected }) =>
    isSelected ? "var(--bg-color)" : "var(--normal-text-color)"};
  padding: 2px 16px 4px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  width: auto;
  height: auto;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: var(--sys-main-color);
    color: var(--bg-color);
  }
`;

export default PillButton;
