import styled from "styled-components";
import { SubNameStyled } from "@/Presentation_legacy/pages/RegisterPage";

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
  isInputArea?: boolean;
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
  isInputArea = false,
}: InputFieldProps) => {
  return (
    <>
      {title && <SubNameStyled>{title}</SubNameStyled>}
      {isInputArea ? (
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
  background-color: var(--card-content-bg-color);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) =>
      props.isFocused ? "var(--sys-sub-color)" : "var(--card-bg-color)"};
  color: var(--normal-text-color);
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
  background-color: var(--card-content-bg-color);
  font-family: "Noto Sans KR", sans-serif;
  outline: none;
  border: 2px solid
    ${(props) =>
      props.isFocused ? "var(--sys-sub-color)" : "var(--card-bg-color)"};
  color: var(--normal-text-color);
`;

const CharacterCountStyled = styled.div`
  margin-left: auto;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--line-color);
`;

export default InputField;
