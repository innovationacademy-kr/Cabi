import React, { useState } from "react";
import styled from "@emotion/styled";
import EditButton from "../buttons/EditButton";

// TODO: gyuwlee(?)
// 본 테스트 필드 제거하고, Organism 단위로 텍스트 입력 필드 구현
// 근데 이것도 제대로 작동하긴 합니당

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
`;

interface LentTextFieldProps {
  contentType: "title" | "memo";
  currentContent: string;
}

const LentTextField = (props: LentTextFieldProps): JSX.Element => {
  const { contentType, currentContent } = props;
  const [textValue, setTextValue] = useState(currentContent);
  const [inputValue, setInputValue] = useState(textValue);
  const [isToggle, setIsToggle] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <Container>
      {isToggle === false ? (
        <p>{textValue}</p>
      ) : (
        <input type="text" value={inputValue} onChange={handleChange} />
      )}
      <EditButton
        isToggle={isToggle}
        setIsToggle={setIsToggle}
        contentType={contentType}
        inputValue={inputValue}
        textValue={textValue}
        setTextValue={setTextValue}
        setInputValue={setInputValue}
      />
    </Container>
  );
};

export default LentTextField;
