import { useState } from "react";
import styled from "styled-components";

const DropdownMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  enum PresentationTime {
    HALF = "30분",
    HOUR = "1시간",
    HOUR_HALF = "1시간 30분",
    TWO_HOUR = "2시간",
  }

  const handleOptionSelect = (Option: PresentationTime) => {
    setSelectedOption(Option);
    setIsVisible(false);
  };
  return (
    <DropdownContainer>
      <RegisterTimeInputStyled onClick={() => setIsVisible(!isVisible)}>
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
  top: 50px;
  left: 0;
  width: 350px;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--black);
  background-color: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  overflow: hidden;
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
  }
`;

const RegisterTimeInputStyled = styled.div`
  width: 350px;
  height: 50px;
  border-radius: 10px;
  color: var(--gray-color);
  background-color: var(--white);
  border: none;
  resize: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export default DropdownMenu;
