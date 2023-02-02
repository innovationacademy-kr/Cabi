import { axiosSearchByCabinetNum } from "@/api/axios/axios.custom";
import SearchItem from "@/components/Search/SearchItem";
import { CabinetInfo } from "@/types/dto/cabinet.dto";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const SearchPage = () => {
  const [searchList, setSearchList] = useState<CabinetInfo[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchList([]);
    const searchValue = searchParams.get("q");
    if (searchValue !== null) {
      if (isNaN(Number(searchValue))) {
        // intra_id 검색
      } else {
        // cabinet_num 검색
        const handleSearch = async () => {
          const searchResult = await axiosSearchByCabinetNum(
            Number(searchValue)
          );
          setSearchList(searchResult.data.result);
        };
        handleSearch();
      }
    }
  }, [searchParams]);

  return (
    <WrapperStyled>
      {searchList.length > 0 ? (
        searchList.map((item, index) => <SearchItem {...item} key={index} />)
      ) : (
        <div>검색 기록이 없습니다.</div>
      )}
    </WrapperStyled>
  );
};

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
