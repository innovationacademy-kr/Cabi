import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import EditButton from "../buttons/EditButton";

type divProps = {
  isToggle: boolean;
};

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

const TextDiv = styled.div<divProps>`
  box-sizing: border-box;
  height: 80%;
  width: ${(props) => (props.isToggle ? "72%" : "90%")};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonDiv = styled.div<divProps>`
  box-sizing: border-box;
  height: 80%;
  margin-left: 0.25rem;
  width: ${(props) => (props.isToggle ? "28%" : "10%")};
  display: flex;
  justify-content: center;
  align-items: center;
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
  const [inputValue, setInputValue] = useState(currentContent ? textValue : "");
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    console.log(currentContent);
    if (currentContent) {
      setTextValue(currentContent);
    } else {
      setTextValue(
        contentType === "title"
          ? "방 제목을 입력해주세요"
          : "필요한 내용을 메모해주세요"
      );
    }
  }, []);

  useEffect(() => {
    if (textValue === "필요한 내용을 메모해주세요") {
      setInputValue("");
    } else setInputValue(textValue);
  }, [textValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const isPrivateAndTitle: boolean =
    cabinetType === "PRIVATE" && contentType === "title";

  return isPrivateAndTitle ? null : (
    <>
      <p style={{ margin: 0 }}>
        {contentType === "title" ? "방 제목" : "비밀스러운 메모장"}
      </p>
      <Container className="Container" style={{ marginBottom: "2rem" }}>
        <TextDiv className="textDiv" isToggle={isToggle}>
          {isToggle === false ? (
            <p style={{ margin: 0 }}>{textValue}</p> // 대체
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          )}
        </TextDiv>
        <ButtonDiv className="buttonDiv" isToggle={isToggle}>
          <EditButton
            isToggle={isToggle}
            setIsToggle={setIsToggle}
            contentType={contentType}
            inputValue={inputValue}
            textValue={textValue}
            setTextValue={setTextValue}
            setInputValue={setInputValue}
          />
        </ButtonDiv>
      </Container>
    </>
  );
};

export default LentTextField;
