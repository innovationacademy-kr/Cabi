import styled from "styled-components";
import SearchListItem from "@/components/TopNav/SearchBar/SearchListItem/SearchListItem";
import { CabinetSimple } from "@/types/dto/cabinet.dto";

interface ISearchListByIntraId {
  name: string;
  userId: number;
}

const SearchBarList = ({
  searchListById,
  searchListByNum,
  searchWord,
  resetSearchState,
  totalLength,
  targetIndex,
}: {
  searchListById: ISearchListByIntraId[];
  searchListByNum: CabinetSimple[];
  resetSearchState: () => void;
  searchWord?: string;
  totalLength: number;
  targetIndex?: number;
}) => {
  return (
    <UlStyled>
      {searchListById.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.name}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index}
          />
        );
      })}
      {searchListByNum.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            floor={item.floor}
            inputText={searchWord}
            resultText={item.visibleNum.toString()}
            isNum={true}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index}
          />
        );
      })}
      {<TotalStyled>검색 결과: {totalLength}</TotalStyled>}
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
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TotalStyled = styled.li`
  font-size: 0.875rem;
  color: var(--gray-color);
  text-align: right;
  padding: 10px;
`;

export default SearchBarList;
