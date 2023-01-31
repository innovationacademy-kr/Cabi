import SearchItem from "@/components/Search/SearchItem";
import styled from "styled-components";

const SearchPage = () => (
  <WrapperStyled>
    <SearchItem></SearchItem>
    <SearchItem></SearchItem>
    <SearchItem></SearchItem>
    <SearchItem></SearchItem>
  </WrapperStyled>
);

const WrapperStyled = styled.div`
  margin: 60px auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-flow: row;
  justify-content: center;
  min-width: 350px;
  grid-gap: 20px;
  width: 100%;
`;

export default SearchPage;
