import styled from "styled-components";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";

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
    color: var(--main-color);
  }

  &.active {
    background-color: var(--main-color);
    color: var(--white);
  }
  &.active strong {
    color: var(--white);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
    &:hover strong {
      color: var(--white);
    }
  }
`;

export default SlackNotiSearchListItem;
