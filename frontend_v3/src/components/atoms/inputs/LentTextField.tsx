import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import EditButton from "../buttons/EditButton";
import useInput from "../../../hooks/useInput";

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
  @media (max-width: 281px) {
    font-size: 0.7rem;
  }
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

type inputType = {
  text: string;
};

const initialState: inputType = {
  text: "",
};

interface LentTextFieldProps {
  contentType: "title" | "memo";
  currentContent: string | undefined;
  cabinetType: string | undefined;
}

const defaultText: string[] = [
  "방 제목을 입력해주세요",
  "필요한 내용을 메모해주세요",
];

const LentTextField = (props: LentTextFieldProps): JSX.Element | null => {
  const { contentType, currentContent, cabinetType } = props;
  const [textValue, setTextValue] = useState<string>("");
  const [isToggle, setIsToggle] = useState(false);
  const [input, setInput, onChange, resetInput] = useInput(initialState);
  const { text } = input;

  useEffect(() => {
    if (currentContent) {
      setTextValue(currentContent);
    } else {
      setTextValue(contentType === "title" ? defaultText[0] : defaultText[1]);
    }
  }, [currentContent]);

  useEffect(() => {
    if (defaultText.includes(textValue)) {
      resetInput();
    } else {
      setInput({ text: textValue });
    }
  }, [textValue]);

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
              name="text"
              value={text}
              onChange={(e) => onChange(e)}
              style={{ width: "100%" }}
              maxLength={13}
            />
          )}
        </TextDiv>
        <ButtonDiv className="buttonDiv" isToggle={isToggle}>
          <EditButton
            isToggle={isToggle}
            setIsToggle={setIsToggle}
            contentType={contentType}
            inputValue={text}
            textValue={textValue}
            setTextValue={setTextValue}
            setInputValue={setInput}
            resetInputValue={resetInput}
          />
        </ButtonDiv>
      </Container>
    </>
  );
};

export default LentTextField;
