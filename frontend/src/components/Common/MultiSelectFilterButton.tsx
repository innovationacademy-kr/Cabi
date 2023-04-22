import styled from "styled-components";

interface IMultiSelectFilterButton {
  theme: string;
  text: string;
  onClick: any;
}

const MultiSelectFilterButton = ({
  theme,
  text,
  onClick,
}: IMultiSelectFilterButton) => {
  return (
    <FilterButtonWrapperStyled onClick={onClick}>
      <FilterIconWrapperStyled>
        <FilterIconStyled
          src={
            theme === "line"
              ? "/src/assets/images/selectFilterIconOff.svg"
              : "/src/assets/images/selectFilterIconOn.svg"
          }
        />
      </FilterIconWrapperStyled>
      <FilterTextWrapperStyled isClicked={theme === "fill"}>
        {text}
      </FilterTextWrapperStyled>
    </FilterButtonWrapperStyled>
  );
};

const FilterButtonWrapperStyled = styled.button`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100px;
  height: 24px;
  border: none;
  background: transparent;
`;

const FilterIconWrapperStyled = styled.div`
  width: 24px;
  height: 24px;
`;

const FilterTextWrapperStyled = styled.div<{ isClicked: boolean }>`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: ${({ isClicked }) =>
    isClicked ? "var(--main-color)" : "var(--line-color)"};
  font-size: 16px;
`;

const FilterIconStyled = styled.img`
  width: 100%;
  height: 100%;
`;

export default MultiSelectFilterButton;
