import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import chevronIcon from "@/assets/images/dropdownChevron.svg";

const DropdownDateMenu = ({
  onClick,
}: {
  onClick: (selectedDate: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isIconRotated, setIsIconRotated] = useState(false);

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

  enum PresentationDate {
    THIS_MONTH_FIRST = "2/7",
    THIS_MONTH_SECOND = "2/14",
    THIS_MONTH_THIRD = "2/21",
    THIS_MONTH_FOURTH = "2/28",
    NEXT_MONTH_FIRST = "3/6",
    NEXT_MONTH_SECOND = "3/13",
    NEXT_MONTH_THIRD = "3/20",
    NEXT_MONTH_FOURTH = "3/21",
  }

  const handleOptionSelect = (option: PresentationDate) => {
    setSelectedOption(option);
    setIsVisible(false);
    setIsFocused(false);
    setIsIconRotated(false);
    onClick(option);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsFocused(!isVisible);
    setIsIconRotated(!isIconRotated);
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
      {isVisible && (
        <DropdownOptions>
          {Object.values(PresentationDate).map((time) => (
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
  margin-top: 10px;
  position: absolute;
  top: 52px;
  left: 0;
  width: 310px;
  height: 160px;
  z-index: 1;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--black);
  background-color: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  overflow-y: scroll;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownOption = styled.li`
  font-size: 0.875rem;
  color: var(--gray-color);
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
    color: #3f69fd;
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
`;

export default DropdownDateMenu;
