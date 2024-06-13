import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChangeToHTML from "@/Cabinet/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";
import { ReactComponent as CabinetIcon } from "@/Cabinet/assets/images/cabinet.svg";
import { ReactComponent as PrivateIcon } from "@/Cabinet/assets/images/privateIcon.svg";

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
      <ContentIconStyled title="유저">
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
    color: var(--button-line-color);
  }

  &.active {
    background-color: var(--button-line-color);
    color: var(--white-text-with-bg-color);
  }
  &.active strong {
    color: var(--white-text-with-bg-color);
  }
  &.active path {
    stroke: var(--white-text-with-bg-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--button-line-color);
      color: var(--white-text-with-bg-color);
    }
    &:hover strong {
      color: var(--white-text-with-bg-color);
    }
    &:hover path {
      stroke: var(--white-text-with-bg-color);
    }
  }
`;

const ContentIconStyled = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 8px;

  & > svg {
    width: 20px;
    height: 20px;
  }

  & > svg > path {
    stroke: var(--normal-text-color);
  }

  &:hover & > svg > path {
    stroke: var(--white-text-with-bg-color);
  }
`;

export default SearchListItem;
