import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";
import {
  currentCabinetIdState,
  currentIntraIdState,
  numberOfAdminWorkState,
} from "@/Cabinet/recoil/atoms";
import LoadingAnimation from "@/Cabinet/components/Common/LoadingAnimation";
import NoSearch from "@/Cabinet/components/Search/NoSearch";
import SearchDefault from "@/Cabinet/components/Search/SearchDefault";
import SearchItemByIntraId from "@/Cabinet/components/Search/SearchItemByIntraId";
import SearchItemByNum from "@/Cabinet/components/Search/SearchItemByNum";
import { CabinetInfo } from "@/Cabinet/types/dto/cabinet.dto";
import {
  axiosSearchByCabinetNum,
  axiosSearchDetailByIntraId,
} from "@/Cabinet/api/axios/axios.custom";

interface ISearchDetail {
  name: string;
  userId: number;
  bannedAt?: Date;
  unbannedAt?: Date;
  cabinetInfo?: CabinetInfo;
}

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchListByNum, setSearchListByNum] = useState<CabinetInfo[]>([]);
  const [searchListByIntraId, setSearchListByIntraId] = useState<
    ISearchDetail[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSearchList, setTotalSearchList] = useState(0);
  const currentPage = useRef(0);
  const searchValue = useRef("");
  const searchFloor = useRef(0);
  const resetCurrentCabinetId = useResetRecoilState(currentCabinetIdState);
  const resetCurrentIntraId = useResetRecoilState(currentIntraIdState);
  const numberOfAdminWork = useRecoilValue(numberOfAdminWorkState);

  // 검색 초기화
  const initialize = () => {
    setIsLoading(true);
    setSearchListByIntraId([]);
    setSearchListByNum([]);
    setTotalSearchList(0);
    currentPage.current = 0;
    searchValue.current = searchParams.get("q") ?? "";
    searchFloor.current = Number(searchParams.get("floor")) ?? 0;
    resetCurrentCabinetId();
    resetCurrentIntraId();
  };

  // name 검색
  const handleSearchDetailByIntraId = async () => {
    const searchResult = await axiosSearchDetailByIntraId(
      searchValue.current,
      currentPage.current
    );

    setSearchListByIntraId(searchResult.data.result ?? []);
    setTotalSearchList(Math.ceil(searchResult.data.totalLength / 10) ?? 0);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // visibleNum 검색
  const handleSearchByCabinetNum = async () => {
    const searchResult = await axiosSearchByCabinetNum(
      Number(searchValue.current)
    );
    let searchResultData: CabinetInfo[] = searchResult.data.result;
    searchResultData.sort((a, b) => a.floor - b.floor);
    if (searchFloor.current !== 0) {
      searchResultData = searchResultData.filter(
        (item: CabinetInfo) => item.floor === searchFloor.current
      );
    }
    setSearchListByNum(searchResultData ?? []);
    setTotalSearchList(Math.ceil(searchResult.data.totalLength / 10) ?? 0);
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
  }, [searchParams, numberOfAdminWork]);

  // name 검색 더보기
  const handleMoreSearchDetailByIntraId = async () => {
    const searchResult = await axiosSearchDetailByIntraId(
      searchValue.current,
      currentPage.current + 1
    );
    currentPage.current += 1;
    setSearchListByIntraId((prev) => [...prev, ...searchResult.data.result]);
  };

  const clickMoreButton = () => {
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
            {totalSearchList > 1 &&
              currentPage.current < totalSearchList - 1 && (
                <MoreButtonStyled onClick={clickMoreButton}>
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
    background: url(/src/Cabinet/assets/images/selectPurple.svg) no-repeat 100%;
  }
`;

export default SearchPage;
