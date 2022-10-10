import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import EditButton from "../buttons/EditButton";

const Container = styled.div`
  display: flex;
  width: 70%;
  height: 2rem;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fafafa;
  padding: 0.5rem 1rem;
  margin-top: 0.2rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: inset 5px 5px 9px #ededed, inset -5px -5px 9px #ffffff;
`;

const TextDiv = styled.div`
  box-sizing: border-box;
  height: 80%;
  width: 90%;
  display: flex;
  justify-content: center;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface LentTextFieldProps {
  contentType: "title" | "memo";
  currentContent: string | undefined;
  cabinetType: string | undefined;
}

const LentTextField = (props: LentTextFieldProps): JSX.Element | null => {
  const { contentType, currentContent, cabinetType } = props;
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

  const isPrivateAndTitle: boolean =
    cabinetType === "PRIVATE" && contentType === "title";

  return isPrivateAndTitle ? null : (
    <>
      <p>{contentType === "title" ? "방 제목" : "비밀스러운 메모장"}</p>
      <Container className="Container" style={{ marginBottom: "2rem" }}>
        <TextDiv className="textDiv">
          {isToggle === false ? (
            <p style={{ margin: 0 }}>{textValue}</p> // 대체
          ) : (
            <input type="text" value={inputValue} onChange={handleChange} />
          )}
        </TextDiv>
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
    </>
  );
};

export default LentTextField;
