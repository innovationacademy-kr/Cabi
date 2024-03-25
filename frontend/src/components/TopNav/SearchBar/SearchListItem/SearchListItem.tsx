import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";
import { ReactComponent as CabinetIcon } from "@/assets/images/cabinet.svg";
import { ReactComponent as PrivateIcon } from "@/assets/images/privateIcon.svg";

const SearchListItem = (props: {
  floor?: number;
  inputText?: string;
  resultText: string;
  isNum?: boolean;
  resetSearchState: () => void;
  isTargetIndex?: boolean;
}) => {
  const {
    floor,
    resultText,
    inputText,
    isNum,
    resetSearchState,
    isTargetIndex,
  } = props;
  const navigate = useNavigate();

  return (
    <LiStyled
      className={isTargetIndex ? "active" : ""}
      onClick={() => {
        let query = floor
          ? `?q=${resultText}&floor=${floor}`
          : `?q=${resultText}`;
        navigate({
          pathname: "search",
          search: query,
        });
        resetSearchState();
      }}
    >
      <ContentIconStyled isNum={isNum} title="유저">
        {isNum ? <CabinetIcon /> : <PrivateIcon />}
      </ContentIconStyled>
      {isNum && <span>{floor}F - </span>}
      <ChangeToHTML origin={resultText} replace={inputText} />
    </LiStyled>
  );
};

const LiStyled = styled.li`
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;

  & strong {
    color: var(--main-color);
  }

  &.active {
    background-color: var(--main-color);
    color: var(--color-background);
  }
  &.active strong {
    color: var(--color-background);
  }
  &.active div {
    filter: invert(100%);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--color-background);
    }
    &:hover strong {
      color: var(--color-background);
    }
    &:hover div {
      filter: invert(100%);
    }
  }
`;

const ContentIconStyled = styled.div<{ isNum?: boolean }>`
  width: 20px;
  height: 20px;
  margin-right: 8px;

  & > svg {
    width: 20px;
    height: 20px;
  }

  & path {
    stroke: var(--color-text-normal);
    transform: ${(props) => (props.isNum ? "scale(1)" : "scale(0.8)")};
  }
`;

export default SearchListItem;
