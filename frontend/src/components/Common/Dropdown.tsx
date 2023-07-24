import { useState } from "react";
import styled, { css } from "styled-components";

interface IDropdown {
  options: { name: string; value: any; imageSrc?: string }[];
  defaultValue: string;
  defaultImageSrc?: string;
  onChangeValue?: (param: any) => any;
}

const Dropdown = ({ options, defaultValue, onChangeValue }: IDropdown) => {
  const [currentName, setCurrentName] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedIdx = options.findIndex((op) => op.name === currentName) ?? 0;
  return (
    <DropdownContainerStyled>
      <DropdownSelectionBoxStyled
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        isOpen={isOpen}
      >
        {options[selectedIdx].imageSrc && (
          <div style={{ width: "18px", height: "18px" }}>
            <img src={options[selectedIdx].imageSrc} />
          </div>
        )}
        <p style={{ paddingLeft: "10px" }}>{currentName}</p>
        <img src="/src/assets/images/dropdownChevron.svg" />
      </DropdownSelectionBoxStyled>
      <DropdownItemContainerStyled isVisible={isOpen}>
        {options?.map((option) => {
          return (
            <DropdownItemStyled
              key={option.value}
              onClick={() => {
                setCurrentName(option.name);
                setIsOpen(false);
                if (onChangeValue) {
                  onChangeValue(option.value);
                }
              }}
              isSelected={option.name === currentName}
            >
              {option.imageSrc && (
                <div style={{ width: "18px", height: "18px" }}>
                  <img src={option.imageSrc} />
                </div>
              )}
              <p style={{ paddingLeft: "10px" }}>{option.name}</p>
            </DropdownItemStyled>
          );
        })}
      </DropdownItemContainerStyled>
    </DropdownContainerStyled>
  );
};

const DropdownContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const DropdownSelectionBoxStyled = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 18px;
  color: var(--main-color);
  & > img {
    filter: contrast(0.6);
    width: 14px;
    height: 8px;
    position: absolute;
    top: 45%;
    left: 85%;
    ${({ isOpen }) =>
      isOpen === true &&
      css`
        transform: scaleY(-1);
      `}
  }
`;

const DropdownItemContainerStyled = styled.div<{ isVisible: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 110%;
  z-index: 99;
  ${({ isVisible }) =>
    isVisible !== true &&
    css`
      visibility: hidden;
    `}
`;

const DropdownItemStyled = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) => (isSelected ? "#f1f1f1" : "white")};
  border: 1px solid var(--line-color);
  border-width: 0px 1px 1px 1px;
  width: 100%;
  height: 60px;
  text-align: start;
  padding-left: 20px;
  font-size: 18px;
  color: ${({ isSelected }) => (isSelected ? "var(--main-color)" : "black")};
  cursor: pointer;
  &:first-child {
    border-radius: 10px 10px 0px 0px;
    border-width: 1px 1px 1px 1px;
  }
  &:last-child {
    border-radius: 0px 0px 10px 10px;
  }
  &:hover {
    background-color: #f1f1f1;
  }
`;

export default Dropdown;
