import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { cabinetIconComponentMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as DropdownChevronIcon } from "@/Cabinet/assets/images/dropdownChevron.svg";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";

export interface IDropdownOptions {
  name: string;
  value: any;
  imageSrc?: string;
  isDisable?: boolean;
}

export interface IDropdown {
  options: IDropdownOptions[];
  defaultValue: string;
  defaultImageSrc?: string;
  onChangeValue?: (param: any) => any;
}

const Dropdown = ({ options, defaultValue, onChangeValue }: IDropdown) => {
  const [currentName, setCurrentName] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedIdx = options.findIndex((op) => op.name === currentName) ?? 0;
  const DefaultOptionIcon =
    cabinetIconComponentMap[options[selectedIdx].value as CabinetType];

  return (
    <DropdownContainerStyled>
      <DropdownSelectionBoxStyled
        onClick={() => {
          if (options[selectedIdx].isDisable) return;
          setIsOpen(!isOpen);
        }}
      >
        {options[selectedIdx].imageSrc?.length && (
          <OptionsImgStyled>
            <DefaultOptionIcon />
          </OptionsImgStyled>
        )}
        <p style={{ paddingLeft: "10px" }}>{currentName}</p>
        <DropdownSelectionBoxIconStyled isOpen={isOpen}>
          <DropdownChevronIcon />
        </DropdownSelectionBoxIconStyled>
      </DropdownSelectionBoxStyled>
      <DropdownItemContainerStyled isVisible={isOpen}>
        {options.map((option) => {
          const OptionIcon =
            cabinetIconComponentMap[option.value as CabinetType];
          return (
            <DropdownItemStyled
              key={option.value}
              onClick={() => {
                if (!option.disabled) {
                  setCurrentName(option.name);
                  setIsOpen(false);
                  if (onChangeValue) {
                    onChangeValue(option.value);
                  }
                }
              }}
              isSelected={option.name === currentName}
              isDisabled={option.isDisable}
            >
              {option.imageSrc && (
                <OptionsImgStyled isSelected={option.name === currentName}>
                  <OptionIcon />
                </OptionsImgStyled>
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
  cursor: pointer;
`;

const DropdownSelectionBoxStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--line-color);
  width: 100%;
  height: 60px;
  border-radius: 10px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  color: var(--sys-main-color);
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

const DropdownItemStyled = styled.div<{
  isSelected: boolean;
  isDisabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--map-floor-color)" : "var(--bg-color)"};
  border: 1px solid var(--line-color);
  border-width: 0px 1px 1px 1px;
  width: 100%;
  height: 60px;
  text-align: start;
  padding-left: 20px;
  font-size: 1.125rem;
  /* color: ${({ isSelected }) =>
    isSelected ? "var(--sys-main-color)" : "var(--normal-text-color)"};
  cursor: pointer; */
  color: ${({ isSelected, isDisabled }) =>
    isDisabled
      ? "var(--capsule-btn-border-color)"
      : isSelected
      ? "var(--sys-main-color)"
      : "var(--normal-text-color)"};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  &:first-child {
    border-radius: 10px 10px 0px 0px;
    border-width: 1px 1px 1px 1px;
  }
  &:last-child {
    border-radius: 0px 0px 10px 10px;
  }
  &:hover {
    background-color: var(--map-floor-color);
  }
`;

const OptionsImgStyled = styled.div<{ isSelected?: boolean }>`
  width: 18px;
  height: 18px;

  svg {
    width: 18px;
    height: 18px;
  }

  & > svg > path {
    stroke: var(--normal-text-color);
  }
`;

const DropdownSelectionBoxIconStyled = styled.div<{ isOpen: boolean }>`
  width: 14px;
  height: 8px;
  display: flex;
  position: absolute;
  top: 45%;
  left: 85%;
  ${({ isOpen }) =>
    isOpen === true &&
    css`
      transform: scaleY(-1);
    `}

  & > svg > path {
    stroke: var(--line-color);
  }
`;

export default Dropdown;
