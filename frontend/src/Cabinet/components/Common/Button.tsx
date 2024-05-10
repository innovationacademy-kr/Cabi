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
      background: var(--sys-main-color);
      color: var(--white-text-with-bg-color);
    `}
  ${(props) =>
    props.theme === "line" &&
    css`
      background: var(--bg-color);
      color: var(--button-line-color);
      border: 1px solid var(--button-line-color);
    `}
  ${(props) =>
    props.theme === "light-grayLine" &&
    css`
      background: var(--bg-color);
      color: var(--light-gray-line-btn-color);
      border: 1px solid var(--light-gray-line-btn-color);
    `}
  ${(props) =>
    props.theme === "grayLine" &&
    css`
      background: var(--bg-color);
      color: var(--gray-line-btn-color);
      border: 1px solid var(--gray-line-btn-color);
    `}
  ${(props) =>
    props.theme === "smallGrayLine" &&
    css`
      max-width: 200px;
      height: 40px;
      background: var(--bg-color);
      color: var(--gray-line-btn-color);
      font-size: 0.875rem;
      border: 1px solid var(--gray-line-btn-color);
    `}

  @media (max-height: 745px) {
    margin-bottom: 8px;
  }
`;

export default Button;
