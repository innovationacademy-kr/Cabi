import { useCallback, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import chevronIcon from "@/Cabinet/assets/images/dropdownChevron.svg";
import useClickOutside from "@/Presentation/hooks/useClickOutside";

const DropdownDateMenu = ({
  data,
  invalidDates,
  onClick,
}: {
  data: string[];
  invalidDates: string[];
  onClick: (selectedDate: string) => void;
}) => {
  const [dropdownState, setDropdownState] = useState({
    isVisible: false,
    isFocused: false,
    isIconRotated: false,
  });
  const [clickCount, setClickCount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setDropdownState((prev) => ({
      ...prev,
      isVisible: false,
      isFocused: false,
      isIconRotated: false,
    }));
  });

  const handleOptionSelect = useCallback(
    (option: string, displayOption: string) => {
      setSelectedOption(displayOption);
      setDropdownState((prev) => ({
        ...prev,
        isVisible: false,
        isFocused: false,
        isIconRotated: false,
      }));
      onClick(option);
    },
    [onClick]
  );

  const toggleVisibility = useCallback(() => {
    setClickCount((prevCount) => prevCount + 1);
    setDropdownState((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
      isFocused: !prev.isFocused,
      isIconRotated: !prev.isIconRotated,
    }));
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <RegisterTimeInputStyled
        onClick={toggleVisibility}
        isFocused={dropdownState.isFocused}
        hasSelectedOption={selectedOption !== ""}
      >
        {selectedOption || "날짜를 선택해주세요"}
        <DropdownIcon
          src={chevronIcon}
          alt="Dropdown Icon"
          rotated={dropdownState.isFocused}
        />
      </RegisterTimeInputStyled>
      <AnimatedDropdownOptionsStyled
        isVisible={dropdownState.isVisible}
        clickCount={clickCount}
      >
        {data.map((time, index) => {
          const displayTime = time.split("/").slice(1).join("/");
          return (
            <DropdownOption
              key={index}
              onClick={() => handleOptionSelect(time, displayTime)}
              invalid={invalidDates?.includes(time)}
            >
              {displayTime}
            </DropdownOption>
          );
        })}
      </AnimatedDropdownOptionsStyled>
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

const AnimatedDropdownOptionsStyled = styled.ul<{
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
  border: 1px solid var(--card-content-bg-color);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--normal-text-color);
  background-color: var(--card-content-bg-color);
  box-shadow: 0 0 10px 0 var(--table-border-shadow-color-200);
  overflow-y: auto;
  scrollbar-width: thin;
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
  color: ${({ invalid }) =>
    invalid ? "var(--gray-line-btn-color)" : "var(--normal-text-color)"};
  background-color: ${({ invalid }) =>
    invalid ? "var(--card-bg-color)" : "transparent"};
  &:hover {
    background-color: ${({ invalid }) =>
      invalid
        ? "var(--card-bg-color)"
        : "var(--presentation-dropdown-select-color)"};
    cursor: ${({ invalid }) => (invalid ? "not-allowed" : "pointer")};
  }

  ${({ invalid }) =>
    invalid &&
    `
    pointer-events: none;
    cursor: not-allowed;
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
  background-color: var(--card-content-bg-color);
  border: 2px solid
    ${(props) =>
      props.isFocused
        ? "var(--sys-sub-color)"
        : "var(--card-content-bg-color)"};
  resize: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding-left: 10px;
  color: ${(props) =>
    props.isFocused || !props.hasSelectedOption
      ? "var(--gray-line-btn-color)"
      : "var(--normal-text-color)"};
`;

const DropdownIcon = styled.img<{ rotated: boolean }>`
  width: 14px;
  height: 8px;
  transform: ${(props) => (props.rotated ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease-in-out;
`;

export default DropdownDateMenu;
