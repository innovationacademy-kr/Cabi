import styled from "styled-components";

const SlackNotiTextArea = ({
  msgTextAreaRef,
  checkInputs,
  receiverInputRef,
}: {
  msgTextAreaRef: React.RefObject<HTMLTextAreaElement>;
  checkInputs: (receiverInput?: string, msgTextArea?: string) => void;
  receiverInputRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <FormTextareaStyled
      ref={msgTextAreaRef}
      onChange={(e) =>
        checkInputs(receiverInputRef.current?.value, e.target.value)
      }
    />
  );
};

const FormTextareaStyled = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 200px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  resize: none;
  outline: none;
  :focus {
    border: 1px solid var(--main-color);
  }
  text-align: left;
  padding: 10px;
  ::placeholder {
    color: var(--line-color);
  }
`;

export default SlackNotiTextArea;
