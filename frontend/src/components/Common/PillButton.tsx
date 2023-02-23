import styled from "styled-components";

interface IPillButtonProps {
  text: string;
  theme: string;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
}

const PillButton = ({ text, theme, onClick }: IPillButtonProps) => {
  return (
    <PillButtonContainerStyled theme={theme} onClick={onClick}>
      {text}
    </PillButtonContainerStyled>
  );
};

const PillButtonContainerStyled = styled.button<{
  theme: string;
}>`
  background-color: ${({ theme }) =>
    theme === "fill" ? "var(--main-color)" : "transparent"};
  border: ${({ theme }) =>
    theme === "fill" ? "none" : "1px solid var(--line-color)"};
  color: ${({ theme }) => (theme === "fill" ? "var(--white)" : "var(--black)")};
  padding: 2px 10px 4px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;
  width: auto;
  height: auto;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: var(--main-color);
    color: var(--white);
  }
`;

export default PillButton;
