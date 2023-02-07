import {
  axiosSearchByCabinetNum,
  axiosSearchDetailByIntraId,
} from "@/api/axios/axios.custom";
import SearchItemByNum from "@/components/Search/SearchItemByNum";
import SearchItemByIntraId from "@/components/Search/SearchItemByIntraId";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import LoadingAnimation from "@/components/Common/LoadingAnimation";
import NoSearch from "@/components/Search/NoSearch";
import SearchDefault from "@/components/Search/SearchDefault";

interface ISearchDetail {
  intra_id: string;
  user_id: number;
  cabinetInfo?: CabinetInfo;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchListByNum, setSearchListByNum] = useState<CabinetInfo[]>([]);
  const [searchListByIntraId, setSearchListByIntraId] = useState<
    ISearchDetail[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSearchList, setTotalSearchList] = useState(0);
  const currentPage = useRef(0);
  const searchValue = useRef("");

  // 검색 초기화
  const initialize = () => {
    console.log("currentPage: " + currentPage);
    setIsLoading(true);
    setSearchListByIntraId([]);
    setSearchListByNum([]);
    setTotalSearchList(0);
    currentPage.current = 0;
    searchValue.current = searchParams.get("q") ?? "";
  };

  // intra_id 검색
  const handleSearchDetailByIntraId = async () => {
    const searchResult = await axiosSearchDetailByIntraId(
      searchValue.current,
      currentPage.current
    );
    console.log(searchResult.data);
    setSearchListByIntraId(searchResult.data.result);
    setTotalSearchList(searchResult.data.total_length);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // cabinet_num 검색
  const handleSearchByCabinetNum = async () => {
    const searchResult = await axiosSearchByCabinetNum(
      Number(searchValue.current)
    );
    console.log(searchResult.data);
    setSearchListByNum(searchResult.data.result);
    setTotalSearchList(searchResult.data.total_length);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    initialize();
    if (searchValue.current === "") {
      setIsLoading(false);
    } else {
      if (isNaN(Number(searchValue.current))) {
        handleSearchDetailByIntraId();
      } else {
        handleSearchByCabinetNum();
      }
    }
  }, [searchParams]);

  // intra_id 검색 더보기
  const handleMoreSearchDetailByIntraId = async () => {
    const searchResult = await axiosSearchDetailByIntraId(
      searchValue.current,
      currentPage.current++
    );
    console.log(searchResult.data);
    setSearchListByIntraId((prev) => [...prev, ...searchResult.data.result]);
  };

  const handleMoreButton = () => {
    handleMoreSearchDetailByIntraId();
  };

  return (
    <>
      {isLoading && <LoadingAnimation />}
      {!isLoading &&
        (searchListByIntraId.length !== 0 || searchListByNum.length !== 0) && (
          <WrapperStyled>
            <ListWrapperStyled>
              {searchListByIntraId.length > 0 &&
                searchListByIntraId.map((item, index) => (
                  <SearchItemByIntraId
                    {...item}
                    key={index}
                    searchValue={searchValue.current}
                  />
                ))}

              {searchListByNum.length > 0 &&
                searchListByNum.map((item, index) => (
                  <SearchItemByNum {...item} key={index} />
                ))}
            </ListWrapperStyled>
            {totalSearchList > 10 &&
              currentPage.current * 10 < totalSearchList - 10 && (
                <MoreButtonStyled onClick={handleMoreButton}>
                  더보기
                </MoreButtonStyled>
              )}
          </WrapperStyled>
        )}
      {!isLoading && !searchParams.get("q") && <SearchDefault />}
      {!isLoading &&
        searchParams.get("q") &&
        searchListByIntraId.length === 0 &&
        searchListByNum.length === 0 && <NoSearch />}
    </>
  );
};

const WrapperStyled = styled.div`
  padding: 60px 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListWrapperStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-flow: row;
  justify-content: center;
  min-width: 350px;
  grid-gap: 20px;
  width: 100%;
`;

const MoreButtonStyled = styled.button`
  width: 240px;
  height: 60px;
  margin: 20px auto;
  border: 1px solid var(--main-color);
  border-radius: 30px;
  text-indent: -20px;
  background-color: var(--white);
  color: var(--main-color);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 55%;
    top: 50%;
    transform: translateY(-40%);
    width: 20px;
    height: 20px;
    background: url(/src/assets/images/selectPurple.svg) no-repeat 100%;
  }
`;

export default SearchPage;
