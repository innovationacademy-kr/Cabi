import React, { useState } from "react";
import styled, { css } from "styled-components";

interface ToggleSwitchInterface {
  id: string;
  onChange?: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const ToggleSwitch = ({
  id,
  onChange,
  checked = false,
  disabled,
}: ToggleSwitchInterface) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <ToggleSwitchContainerStyled disabled={disabled}>
      <InputStyled
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <ToggleSwitchStyled htmlFor={id} checked={isChecked} disabled={disabled}>
        <ToggleKnobStyled checked={isChecked} />
      </ToggleSwitchStyled>
    </ToggleSwitchContainerStyled>
  );
};

const ToggleSwitchContainerStyled = styled.div<{ disabled?: boolean }>`
  display: inline-block;
  position: relative;
  margin-right: 10px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const InputStyled = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
`;

const ToggleSwitchStyled = styled.label<{
  checked: boolean;
  disabled?: boolean;
}>`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: inline-block;
  position: relative;
  background: ${(props) =>
    props.checked ? "var(--main-color)" : "var(--lightgary-color)"};
  width: 56px;
  height: 28px;
  border-radius: 50px;
  transition: background-color 0.2s ease;
  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    transition: 0.2s;
    transform: ${(props) =>
      props.checked ? "translateX(28px)" : "translateX(0)"};
  }
`;

const ToggleKnobStyled = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--white);
  transition: transform 0.2s;
  transform: ${(props) =>
    props.checked ? "translateX(28px)" : "translateX(0)"};
`;

export default ToggleSwitch;
