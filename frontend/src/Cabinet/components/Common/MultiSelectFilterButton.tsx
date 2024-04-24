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
              ? "/src/Cabinet/assets/images/selectFilterIconOff.svg"
              : "/src/Cabinet/assets/images/selectFilterIconOn.svg"
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
    isClicked ? "var(--main-color)" : "var(--shared-gray-color-400)"};
  font-size: 1rem;
`;

const FilterIconStyled = styled.img`
  width: 100%;
  height: 100%;
`;

export default MultiSelectFilterButton;
