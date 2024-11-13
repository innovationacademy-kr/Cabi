import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { cabinetIconComponentMap } from "@/Cabinet/assets/data/maps";
import { ReactComponent as DropdownChevronIcon } from "@/Cabinet/assets/images/dropdownChevron.svg";
import CabinetType from "@/Cabinet/types/enum/cabinet.type.enum";

export interface IDropdownOptions {
  name: string;
  value: any;
  imageSrc?: string;
  isDisabled?: boolean;
  hasNoOptions?: boolean;
}

export interface IDropdownProps {
  options: IDropdownOptions[];
  defaultValue: string;
  defaultImageSrc?: string;
  onChangeValue?: (param: any) => any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeOtherDropdown?: () => void;
}

const Dropdown = ({
  options,
  defaultValue,
  onChangeValue,
  defaultImageSrc,
  isOpen,
  setIsOpen,
  closeOtherDropdown,
}: IDropdownProps) => {
  const [currentName, setCurrentName] = useState(defaultValue);
  const idx: number = options.findIndex((op) => op.name === currentName);
  const selectedIdx: number = idx === -1 ? 0 : idx;
  const DefaultOptionIcon =
    defaultImageSrc &&
    cabinetIconComponentMap[options[selectedIdx].value as CabinetType];

  useEffect(() => {
    setCurrentName(defaultValue);
  }, [defaultValue]);

  return (
    <DropdownContainerStyled>
      <DropdownSelectionBoxStyled
        onClick={() => {
          if (options[selectedIdx].isDisabled) return;
          setIsOpen(!isOpen);
          closeOtherDropdown && closeOtherDropdown();
        }}
      >
        {DefaultOptionIcon && (
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
                if (!option.isDisabled) {
                  setCurrentName(option.name);
                  setIsOpen(false);
                  if (onChangeValue) {
                    onChangeValue(option.value);
                  }
                }
              }}
              isSelected={option.name === currentName}
              isDisabled={option.isDisabled}
              hasNoOptions={option.hasNoOptions}
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
  color: "var(--sys-main-color)";
`;

const DropdownItemContainerStyled = styled.div<{ isVisible: boolean }>`
  width: 100%;
  height: 400%;
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid var(--line-color);
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
  hasNoOptions?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--map-floor-color)" : "var(--bg-color)"};
  border-top: 1px solid var(--line-color);
  width: 100%;
  min-height: 60px;
  text-align: start;
  padding: 15px 20px;
  font-size: 1.125rem;
  color: ${(
      { isSelected, isDisabled } // 비활성화 된 항목은 --capsule-btn-border-color 로 띄우고 클릭 못하게
    ) =>
    isDisabled
      ? "var(--capsule-btn-border-color)"
      : isSelected
        ? "var(--sys-main-color)"
        : "var(--normal-text-color)"};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  &:first-child {
    border: none;
  }
  &:last-child {
    border-radius: ${(props) =>
    props.hasNoOptions ? "10px" : "0px 0px 10px 10px"};
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
