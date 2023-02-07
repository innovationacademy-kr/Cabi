import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBarList from "@/components/TopNav/SearchBar/SearchBarList/SearchBarList";
import {
  axiosSearchByCabinetNum,
  axiosSearchByIntraId,
} from "@/api/axios/axios.custom";
import useOutsideClick from "@/hooks/useOutsideClick";

const SearchBar = () => {
  const navigate = useNavigate();
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchListById, setSearchListById] = useState<any[]>([]);
  const [searchListByNum, setSearchListByNum] = useState<any[]>([]);
  const [totalLength, setTotalLength] = useState<number>(0);
  const [isFocus, setIsFocus] = useState<boolean>(true);

  const searchClear = () => {
    setSearchListById([]);
    setSearchListByNum([]);
    setTotalLength(0);
    if (searchInput.current) {
      searchInput.current.value = "";
    }
  };

  const SearchBarButtonHandler = () => {
    if (searchInput.current) {
      const searchValue = searchInput.current.value;
      if (searchValue.length <= 0) {
        searchClear();
        return alert("검색어를 입력해주세요.");
      } else if (isNaN(Number(searchValue)) && searchValue.length <= 1) {
        searchClear();
        return alert("두 글자 이상의 검색어를 입력해주세요.");
      } else {
        navigate({
          pathname: "search",
          search: `?q=${searchInput.current.value}`,
        });
        searchClear();
      }
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
    console.log("searchInputHandler");

    if (searchInput.current) {
      const searchValue = searchInput.current.value;
      if (searchValue.length <= 0) {
        setSearchListById([]);
        setSearchListByNum([]);
        setTotalLength(0);
        return;
      }
      if (isNaN(Number(searchValue))) {
        // intra_ID 검색
        if (searchValue.length <= 1) {
          setSearchListById([]);
          setTotalLength(0);
        } else {
          const searchResult = await axiosSearchByIntraId(searchValue);
          console.log(searchResult.data.result);
          setSearchListByNum([]);
          setSearchListById(searchResult.data.result);
          setTotalLength(searchResult.data.total_length);
        }
      } else {
        // cabinetnumber 검색
        if (searchValue.length <= 0) {
          setSearchListByNum([]);
          setTotalLength(0);
        } else {
          const searchResult = await axiosSearchByCabinetNum(
            Number(searchValue)
          );
          setSearchListById([]);
          setSearchListByNum(searchResult.data.result);
          setTotalLength(searchResult.data.total_length);
        }
      }
    }
  };

  const cancelHandler = () => {
    document.getElementById("searchBar")!.classList.remove("on");
    document.getElementById("topNavLogo")!.classList.remove("pushOut");
    document.getElementById("topNavButtonGroup")!.classList.remove("pushOut");
    document.getElementById("topNavWrap")!.classList.remove("pushOut");
  };

  const searchWrap = useRef<HTMLDivElement>(null);
  useOutsideClick(searchWrap, () => {
    setIsFocus(false);
  });

  return (
    <SearchBarWrapperStyled ref={searchWrap} id="searchBar">
      <SearchBarStyled
        ref={searchInput}
        type="text"
        placeholder="Search"
        onFocus={() => {
          setIsFocus(true);
        }}
        onChange={debounce(searchInputHandler, 300)}
        onKeyUp={(e: any) => {
          if (e.key === "Enter") {
            SearchBarButtonHandler();
          }
        }}
      ></SearchBarStyled>
      <SearchButtonStyled onClick={SearchBarButtonHandler} />
      {isFocus && searchInput.current?.value && totalLength > 0 && (
        <>
          <SearchBarList
            searchListById={searchListById}
            searchListByNum={searchListByNum}
            searchWord={searchInput.current?.value}
            searchClear={searchClear}
            totalLength={totalLength}
          />
        </>
      )}
      <CancelButtonStyled onClick={cancelHandler}>취소</CancelButtonStyled>
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
  left: 256px;
`;

const CancelButtonStyled = styled.button`
  width: 60px;
  height: 32px;
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export default SearchBar;
