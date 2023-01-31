import styled from "styled-components";
import SearchListItem from "@/components/TopNav/SearchBar/SearchListItem/SearchListItem";

interface ISearchListByIntraId {
  intra_id: string;
  user_id: number;
}

const SearchList = ({
  searchList,
  searchWord,
}: {
  searchList: ISearchListByIntraId[];
  searchWord?: string;
}) => {
  return (
    <UlStyled>
      {searchList.map((item, index: number) => {
        return (
          <SearchListItem
            intraId={item.intra_id}
            key={index}
            searchWord={searchWord}
          />
        );
      })}
    </UlStyled>
  );
};

const UlStyled = styled.ul`
  position: absolute;
  top: 50px;
  left: 0;
  width: 300px;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--black);
  background-color: var(--white);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  overflow: hidden;
`;

export default SearchList;
