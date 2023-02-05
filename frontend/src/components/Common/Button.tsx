import React from "react";
import styled, { css } from "styled-components";

interface ButtonInterface {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  text: string;
  theme: string;
  disabled?: boolean;
}

const Button = (props: ButtonInterface) => {
  return (
    <ButtonContainerStyled
      onClick={props.onClick}
      theme={props.theme}
      disabled={props.disabled}
    >
      {props.text}
    </ButtonContainerStyled>
  );
};

const ButtonContainerStyled = styled.button`
  max-width: 240px;
  width: 100%;
  height: 60px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
  &:disabled {
    cursor: not-allowed;
  }
  &:last-child {
    margin-bottom: 0;
  }
  ${(props) =>
    props.theme === "fill" &&
    css`
      background: var(--main-color);
      color: var(--white);
    `}
  ${(props) =>
    props.theme === "line" &&
    css`
      background: var(--white);
      color: var(--main-color);
      border: 1px solid var(--main-color);
    `}
  ${(props) =>
    props.theme === "lightGrayLine" &&
    css`
      background: var(--white);
      color: var(--line-color);
      border: 1px solid var(--line-color);
    `}
  ${(props) =>
    props.theme === "grayLine" &&
    css`
      background: var(--white);
      color: var(--gray-color);
      border: 1px solid var(--gray-color);
    `}
  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

export default Button;
