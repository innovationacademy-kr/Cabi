import styled, { css } from "styled-components";

interface IMultiSelectButton {
  theme: string;
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const MultiSelectButton = ({ theme, text, onClick }: IMultiSelectButton) => {
  return (
    <ButtonWrapperStyled>
      <MultiSelectButtonContainerStyled theme={theme} onClick={onClick}>
        {text}
      </MultiSelectButtonContainerStyled>
    </ButtonWrapperStyled>
  );
};
const ButtonWrapperStyled = styled.div`
  display: block;
  text-align: -webkit-center;
`;
const MultiSelectButtonContainerStyled = styled.button`
  max-width: 145px;
  width: 100%;
  height: 35px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
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
`;

export default MultiSelectButton;
