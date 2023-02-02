import styled from "styled-components";
import SearchListItem from "@/components/TopNav/SearchBar/SearchListItem/SearchListItem";
import { CabinetInfo } from "@/types/dto/cabinet.dto";

interface ISearchListByIntraId {
  intra_id: string;
  user_id: number;
  // cabinet_info: CabinetInfo;
}
/*
cabinet_id: 87
cabinet_num : 7
cabinet_title:null
lent_type: "PRIVATE"
max_user: 1
section: "End of Cluster 1"
status: "SET_EXPIRE_FULL"
lent_info: [{…}]
*/
const SearchBarList = ({
  searchListById,
  searchListByNum,
  searchWord,
  searchClear,
}: {
  searchListById: ISearchListByIntraId[];
  searchListByNum: CabinetInfo[];
  searchClear: () => void;
  searchWord?: string;
}) => {
  return (
    <UlStyled>
      {searchListById.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.intra_id}
            searchClear={searchClear}
          />
        );
      })}
      {searchListByNum.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            floor={item.floor}
            inputText={searchWord}
            resultText={item.cabinet_num.toString()}
            isNum={true}
            searchClear={searchClear}
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

export default SearchBarList;
