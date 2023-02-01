import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBarList from "@/components/TopNav/SearchBar/SearchBarList/SearchBarList";
import {
  axiosSearchByCabinetNum,
  axiosSearchByIntraId,
} from "@/api/axios/axios.custom";

const SearchBar = () => {
  const navigate = useNavigate();
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchListById, setSearchListById] = useState<any[]>([]);
  const [searchListByNum, setSearchListByNum] = useState<any[]>([]);
  const totalLength = useRef<number>(0);

  const searchClear = () => {
    if (searchInput.current) {
      setSearchListById([]);
      setSearchListByNum([]);
      totalLength.current = 0;
      searchInput.current.value = "";
    }
  };

  const SearchBarButtonHandler = () => {
    if (searchInput.current) {
      if (searchInput.current && searchInput.current.value.length <= 0) return;
      navigate({
        pathname: "search",
        search: `?q=${searchInput.current.value}`,
      });
      searchClear();
    }
  };

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const searchInputHandler = async () => {
    if (searchInput.current) {
      const searchValue = searchInput.current.value;

      if (isNaN(Number(searchValue))) {
        // intra_ID 검색
        if (searchValue.length <= 1) {
          setSearchListById([]);
          totalLength.current = 0;
        } else {
          const searchResult = await axiosSearchByIntraId(searchValue);
          setSearchListById(searchResult.data.result);
          totalLength.current = searchResult.data.result.length;
        }
      } else {
        // cabinetnumber 검색
        if (searchValue.length <= 0) {
          setSearchListByNum([]);
          totalLength.current = 0;
        } else {
          const searchResult = await axiosSearchByCabinetNum(
            Number(searchValue)
          );
          setSearchListByNum(searchResult.data.result);
          totalLength.current = searchResult.data.result.length;
        }
      }
    }
  };

  return (
    <SearchBarWrapperStyled id="searchBar">
      <SearchBarStyled
        ref={searchInput}
        type="text"
        placeholder="Search"
        onChange={debounce(searchInputHandler, 300)}
        onKeyUp={(e: any) => {
          if (e.key === "Enter") {
            SearchBarButtonHandler();
          }
        }}
      ></SearchBarStyled>
      <SearchButtonStyled onClick={SearchBarButtonHandler} />
      {totalLength.current > 0 && (
        <SearchBarList
          searchListById={searchListById}
          searchListByNum={searchListByNum}
          searchWord={searchInput.current?.value}
          searchClear={searchClear}
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
