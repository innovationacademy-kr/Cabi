import styled from "styled-components";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";
import { useNavigate } from "react-router-dom";

const SearchListItem = (props: {
  floor?: number;
  inputText?: string;
  resultText: string;
  isNum?: boolean;
  searchClear: () => void;
  targetIndex?: boolean;
}) => {
  const { floor, resultText, inputText, isNum, searchClear, targetIndex } =
    props;
  const navigate = useNavigate();

  const imageHandler = (isCabinet: boolean | undefined) => {
    if (isCabinet) return "/src/assets/images/cabinet.svg";
    return "/src/assets/images/privateIcon.svg";
  };

  return (
    <LiStyled
      className={targetIndex ? "active" : ""}
      onClick={() => {
        navigate({
          pathname: "search",
          search: `?q=${resultText}`,
        });
        searchClear();
      }}
    >
      <ImgStyled src={imageHandler(isNum)} alt="유저" />
      {isNum && <span>{floor}F - </span>}
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
  &.active img {
    filter: invert(100%);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--main-color);
      color: var(--white);
    }
    &:hover strong {
      color: var(--white);
    }
    &:hover img {
      filter: invert(100%);
    }
  }
`;

const ImgStyled = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

export default SearchListItem;
