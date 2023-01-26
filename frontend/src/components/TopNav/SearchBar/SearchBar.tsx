import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchList from "@/components/TopNav/SearchBar/SearchList/SearchList";
import { axiosSearchByIntraId } from "@/api/axios/axios.custom";

const SearchBar = () => {
  const navigate = useNavigate();
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchList, setSearchList] = useState<any[]>([]);
  const SearchBarButtonHandler = () => {
    navigate("search");
  };

  const searchInputHandler = async () => {
    if (searchInput.current) {
      if (searchInput.current.value.length <= 0) {
        setSearchList([]);
      } else {
        const searchResult = await axiosSearchByIntraId(
          searchInput.current.value
        );
        setSearchList(searchResult.data.result);
      }
    }
  };

  return (
    <SearchBarWrapperStyled>
      <SearchBarStyled
        ref={searchInput}
        type="text"
        placeholder="Search"
        onChange={searchInputHandler}
      ></SearchBarStyled>
      <SearchButtonStyled onClick={SearchBarButtonHandler} />
      {searchList.length > 0 && (
        <SearchList
          searchList={searchList}
          searchWord={searchInput.current?.value}
        />
      )}
    </SearchBarWrapperStyled>
  );
};

const SearchBarWrapperStyled = styled.div`
  position: relative;
`;

const SearchBarStyled = styled.input`
  width: 300px;
  height: 40px;
  border: 1px solid var(--white);
  border-radius: 10px;
  text-align: left;
  padding: 0 20px;
  color: var(--white);
  background-color: rgba(255, 255, 255, 0.2);
  &::placeholder {
    color: var(--white);
  }
`;

const SearchButtonStyled = styled.button`
  background: url("/src/assets/images/searchWhite.svg") no-repeat 50% 50%;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 4px;
  right: 14px;
`;

export default SearchBar;
