import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DropdownDateMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const hasSelectedOption = selectedOption !== "";

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
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsFocused(!isVisible);
  };
  return (
    <DropdownContainer ref={dropdownRef}>
      <RegisterTimeInputStyled
        onClick={toggleVisibility}
        isFocused={isFocused}
        hasSelectedOption={hasSelectedOption}
      >
        {selectedOption || "날짜를 선택해주세요"}
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
  font-size: 0.9rem;
  color: var(--gray-color);
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
    color: var(--main-color);
  }
`;

const RegisterTimeInputStyled = styled.div<{
  isFocused: boolean;
  hasSelectedOption: boolean;
}>`
  height: 46px;
  width: 310px;
  border-radius: 10px;
  background-color: var(--white);
  border: 2px solid
    ${(props) => (props.isFocused ? "var(--main-color)" : "var(--white)")};
  color: ${(props) =>
    props.hasSelectedOption ? "var(--black)" : "var(--gray-color)"};
  resize: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding-left: 10px;
`;

export default DropdownDateMenu;
