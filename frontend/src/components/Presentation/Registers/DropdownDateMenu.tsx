import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import chevronIcon from "@/assets/images/dropdownChevron.svg";

const DropdownDateMenu = ({
  data,
  invalidDates,
  onClick,
}: {
  data: string[];
  invalidDates: string[];
  onClick: (selectedDate: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isIconRotated, setIsIconRotated] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
        setIsFocused(false);
        setIsIconRotated(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsVisible(false);
    setIsFocused(false);
    setIsIconRotated(false);
    onClick(option);
  };

  const toggleVisibility = () => {
    setClickCount(clickCount + 1);
    setIsVisible(!isVisible);
    setIsFocused(!isVisible);
    setIsIconRotated(!isVisible);
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <RegisterTimeInputStyled
        onClick={toggleVisibility}
        isFocused={isFocused}
        hasSelectedOption={selectedOption !== ""}
      >
        {selectedOption ? selectedOption : "날짜를 선택해주세요"}
        <DropdownIcon
          src={chevronIcon}
          alt="Dropdown Icon"
          rotated={isIconRotated}
        />
      </RegisterTimeInputStyled>
      <AnimatedDropdownOptions isVisible={isVisible} clickCount={clickCount}>
        {data.map((time) => (
          <DropdownOption
            key={time}
            onClick={() => handleOptionSelect(time)}
            invalid={invalidDates.includes(time)}
          >
            {time}
          </DropdownOption>
        ))}
      </AnimatedDropdownOptions>
    </DropdownContainer>
  );
};

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const AnimatedDropdownOptions = styled.ul<{
  isVisible: boolean;
  clickCount: number;
}>`
  height: 160px;
  margin-top: 4px;
  position: absolute;
  top: 52px;
  left: 0;
  width: 100%;
  z-index: 1;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--black);
  background-color: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #aaa #fff;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  animation: ${(props) =>
      props.clickCount > 0 && props.isVisible
        ? slideDown
        : props.clickCount > 0 && !props.isVisible
        ? slideUp
        : "none"}
    0.2s ease-in-out forwards;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownOption = styled.li<{ invalid: boolean }>`
  font-size: 0.875rem;
  padding: 10px;
  cursor: pointer;
  color: ${({ invalid }) => (invalid ? "var(--gray-color)" : "var(--black)")};
  background-color: ${({ invalid }) => (invalid ? "#f0f0f0" : "transparent")};
  &:hover {
    background-color: ${({ invalid }) => (invalid ? "#f0f0f0" : "#e8e8e8")};
    color: ${({ invalid }) => (invalid ? "var(--gray-color)" : "#3f69fd")};
    cursor: ${({ invalid }) => (invalid ? "not-allowed" : "pointer")};
  }

  ${({ invalid }) =>
    invalid &&
    `
    pointer-events: none;
  `}
`;

const RegisterTimeInputStyled = styled.div<{
  isFocused: boolean;
  hasSelectedOption: boolean;
}>`
  height: 46px;
  justify-content: space-between;
  padding-right: 10px;
  width: 100%;
  border-radius: 10px;
  background-color: var(--white);
  border: 2px solid ${(props) => (props.isFocused ? "#91B5FA" : "var(--white)")};
  color: ${(props) =>
    props.hasSelectedOption ? "var(--black)" : "var(--gray-color)"};
  resize: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding-left: 10px;
  color: ${(props) =>
    props.isFocused || !props.hasSelectedOption
      ? "var(--gray-color)"
      : "var(--black)"};
`;

const DropdownIcon = styled.img<{ rotated: boolean }>`
  width: 14px;
  height: 8px;
  transform: ${(props) => (props.rotated ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease-in-out;
`;

export default DropdownDateMenu;
