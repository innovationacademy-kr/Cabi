import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DropdownMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  enum PresentationTime {
    HALF = "30분",
    HOUR = "1시간",
    HOUR_HALF = "1시간 30분",
    TWO_HOUR = "2시간",
  }

  const handleOptionSelect = (option: PresentationTime) => {
    setSelectedOption(option);
    setIsVisible(false);
    setIsFocused(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsFocused(!isVisible);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <RegisterTimeInputStyled onClick={toggleVisibility} isFocused={isFocused}>
        {selectedOption || "시간을 선택해주세요"}
      </RegisterTimeInputStyled>
      {isVisible && (
        <DropdownOptions>
          {Object.values(PresentationTime).map((time) => (
            <DropdownOption key={time} onClick={() => handleOptionSelect(time)}>
              {time}
            </DropdownOption>
          ))}
        </DropdownOptions>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownOptions = styled.ul`
  position: absolute;
  top: 52px;
  left: 0;
  width: 310px;
  border: 1px solid var(--ref-white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--ref-black);
  background-color: var(--ref-white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownOption = styled.li`
  font-size: 0.875rem;
  color: var(--shared-gray-color-500);
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
    color: var(--sys-presentation-main-color);
  }
`;

const RegisterTimeInputStyled = styled.div<{ isFocused: boolean }>`
  height: 46px;
  width: 310px;
  border-radius: 10px;
  background-color: var(--ref-white);
  border: 2px solid
    ${(props) =>
      props.isFocused
        ? "var(--sys-presentation-main-color)"
        : "var(--ref-white)"};
  resize: none;
  outline: none;
  color: var(--shared-gray-color-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding-left: 10px;
`;

export default DropdownMenu;
