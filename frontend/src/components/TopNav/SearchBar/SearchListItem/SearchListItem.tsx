import styled from "styled-components";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";

const SearchListItem = (props: {
  key: number;
  inputText: string;
  searchWord?: string;
  isNum?: boolean;
}) => {
  const { inputText, searchWord } = props;

  const imageHandler = (isCabinet: boolean | undefined) => {
    if (isCabinet) return "/src/assets/images/cabinet.svg";
    return "/src/assets/images/privateIcon.svg";
  };

  return (
    <LiStyled>
      <ImgStyled src={imageHandler(props.isNum)} alt="유저" />
      <ChangeToHTML origin={inputText} replace={searchWord} />
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
