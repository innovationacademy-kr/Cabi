import styled from "styled-components";
import ChangeToHTML from "@/Cabinet/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";

const SlackNotiSearchListItem = (props: {
  inputText: string;
  resultText: string;
  isTargetIndex?: boolean;
  renderReceiverInput: (title: string) => void;
}) => {
  const { resultText, inputText, isTargetIndex, renderReceiverInput } = props;

  return (
    <LiStyled
      className={isTargetIndex ? "active" : ""}
      onClick={() => {
        renderReceiverInput(resultText);
      }}
    >
      <ChangeToHTML origin={resultText} replace={inputText} />
    </LiStyled>
  );
};

const LiStyled = styled.li`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  & strong {
    color: var(--sys-main-color);
  }

  &.active {
    background-color: var(--sys-main-color);
    color: var(--white-text-with-bg-color);
  }
  &.active strong {
    color: var(--white-text-with-bg-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--sys-main-color);
      color: var(--white-text-with-bg-color);
    }
    &:hover strong {
      color: var(--white-text-with-bg-color);
    }
  }
`;

export default SlackNotiSearchListItem;
