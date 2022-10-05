import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import EditButton from "../buttons/EditButton";

// TODO: gyuwlee(?)
// 본 테스트 필드 제거하고, Organism 단위로 텍스트 입력 필드 구현
// 근데 이것도 제대로 작동하긴 합니당

const Container = styled.div`
  display: flex;
  width: 70%;
  height: 2rem;
  justify-content: space-between;
  align-items: center;
`;

interface LentTextFieldProps {
  contentType: "title" | "memo";
  currentContent: string | undefined;
}

const LentTextField = (props: LentTextFieldProps): JSX.Element => {
  const { contentType, currentContent } = props;
  const [textValue, setTextValue] = useState<string>(
    currentContent || contentType === "title"
      ? "방 제목을 입력해주세요"
      : "필요한 내용을 메모해주세요"
  );
  const [inputValue, setInputValue] = useState(textValue);
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    if (currentContent) {
      setTextValue(currentContent);
    } else {
      setTextValue(
        contentType === "title"
          ? "방 제목을 입력해주세요"
          : "필요한 내용을 메모해주세요"
      );
    }
  }, [currentContent]);

  useEffect(() => {
    setInputValue(textValue);
  }, [textValue]);

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
