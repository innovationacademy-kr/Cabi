import React from "react";
import styled, { css } from "styled-components";

interface ButtonInterface {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  text: string;
  theme: string;
  disabled?: boolean;
  iconSrc?: string;
  iconAlt?: string;
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
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:last-child {
    margin-bottom: 0;
  }
  ${(props) =>
    props.theme === "fill" &&
    css`
      background: var(--main-color);
      color: var(--color-background);
    `}
  ${(props) =>
    props.theme === "line" &&
    css`
      background: var(--color-background);
      color: var(--main-color);
      border: 1px solid var(--main-color);
    `}
  ${(props) =>
    props.theme === "light-grayLine" &&
    css`
      background: var(--color-background);
      color: var(--gray-tmp-4);
      border: 1px solid var(--color-line);
    `}
  ${(props) =>
    props.theme === "grayLine" &&
    css`
      background: var(--color-background);
      color: var(--gray-tmp-5);
      border: 1px solid var(--gray-tmp-5);
    `}
  ${(props) =>
    props.theme === "smallGrayLine" &&
    css`
      max-width: 200px;
      height: 40px;
      background: var(--color-background);
      color: var(--gray-tmp-5);
      font-size: 0.875rem;
      border: 1px solid var(--gray-tmp-5);
    `}

  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

export default Button;
