import React from "react";
import styled, { css } from "styled-components";

interface ButtonInterface {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  text: string;
  theme: string;
}

const ButtonContainer = (props: ButtonInterface) => {
  return (
    <ButtonContainerStyled onClick={props.onClick} theme={props.theme}>
      {props.text}
    </ButtonContainerStyled>
  );
};

const ButtonContainerStyled = styled.button`
  width: 240px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 15px;
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
    props.theme === "grayLine" &&
    css`
      background: var(--white);
      color: var(--line-color);
      border: 1px solid var(--line-color);
    `}
`;

export default ButtonContainer;
