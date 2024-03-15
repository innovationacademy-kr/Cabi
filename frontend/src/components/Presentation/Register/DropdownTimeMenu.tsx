import { useCallback, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { PresentationTimeKey } from "@/pages/Presentation/RegisterPage";
import { PresentationTimeMap } from "@/assets/data/Presentation/maps";
import chevronIcon from "@/assets/images/dropdownChevron.svg";
import useClickOutside from "@/hooks/Presentation/useClickOutside";

const DropdownTimeMenu = ({
  onClick,
}: {
  onClick: (selectedTime: PresentationTimeKey) => void;
}) => {
  const [dropdownState, setDropdownState] = useState({
    isVisible: false,
    isFocused: false,
    isIconRotated: false,
  });
  const [clickCount, setClickCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PresentationTimeKey>("");
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
    (option: PresentationTimeKey) => {
      setSelectedOption(option);
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
        {selectedOption || "시간을 선택해주세요"}
        <DropdownIcon
          src={chevronIcon}
          alt="Dropdown Icon"
          rotated={dropdownState.isFocused}
        />{" "}
      </RegisterTimeInputStyled>
      <AnimatedDropdownOptions
        isVisible={dropdownState.isVisible}
        clickCount={clickCount}
      >
        {Object.keys(PresentationTimeMap)
          .filter((key) => key)
          .map((timeKey) => {
            const time = timeKey as PresentationTimeKey;
            return (
              <DropdownOption
                key={time}
                onClick={() => handleOptionSelect(time)}
              >
                {time}
              </DropdownOption>
            );
          })}
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

const DropdownOptions = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DropdownOption = styled.li`
  font-size: 0.875rem;
  color: var(--gray-color);
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #dce7ff;
  }
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

export default DropdownTimeMenu;
