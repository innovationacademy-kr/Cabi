import styled from "styled-components";
import ChangeToHTML from "@/components/TopNav/SearchBar/SearchListItem/ChangeToHTML";

const SearchListItem = (props: {
  intraId: string;
  key: number;
  searchWord?: string;
}) => {
  const { intraId, searchWord } = props;

  return (
    <LiStyled>
      <ChangeToHTML origin={intraId} replace={searchWord} />
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
  }
`;

export default SearchListItem;
