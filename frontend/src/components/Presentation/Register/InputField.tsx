import styled from "styled-components";
import { SubNameStyled } from "@/pages/Presentation/RegisterPage";

interface InputFieldProps {
  title?: string;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  maxLength: number;
  placeholder: string;
  onFocus: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  onBlur: (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => void;
  isFocused: boolean;
  isTextArea?: boolean;
}

const InputField = ({
  title,
  value,
  onChange,
  maxLength,
  placeholder,
  onFocus,
  onBlur,
  isFocused,
  isTextArea = false,
}: InputFieldProps) => {
  return (
    <>
      {title && <SubNameStyled>제목</SubNameStyled>}
      {isTextArea ? (
        <InputAreaStyled
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          isFocused={isFocused}
          spellCheck={false}
        />
      ) : (
        <DetailTextareaStyled
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          isFocused={isFocused}
          spellCheck={false}
        />
      )}
      <CharacterCountStyled>
        {value.length} / {maxLength}
      </CharacterCountStyled>
    </>
  );
};

const InputAreaStyled = styled.input<{ isFocused: boolean }>`
  width: 100%;
  height: 50px;
  text-align: left;
  padding: 12px 12px 12px 12px;
  border-radius: 10px;
  border: none;
  resize: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: var(--white);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) => (props.isFocused ? "#91B5FA" : "var(--lightgray-color)")};
`;

const DetailTextareaStyled = styled.textarea<{ isFocused: boolean }>`
  width: 100%;
  height: 180px;
  padding: 12px 12px 12px 12px;
  border-radius: 10px;
  border: none;
  resize: none;
  box-sizing: border-box;
  font-size: 0.875rem;
  background-color: var(--white);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) => (props.isFocused ? "#91B5FA" : "var(--lightgray-color)")};
`;

const CharacterCountStyled = styled.div`
  margin-left: auto;
  margin-top: 5px;
  font-size: 0.75rem;
  color: #a9a9a9;
`;

export default InputField;
