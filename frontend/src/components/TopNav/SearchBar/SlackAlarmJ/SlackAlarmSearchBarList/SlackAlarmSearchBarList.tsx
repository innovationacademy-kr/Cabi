import styled from "styled-components";
import SearchListItem from "@/components/TopNav/SearchBar/SearchListItem/SearchListItem";
import { ISlackChannels } from "../SlackAlarmSearchBar";

interface ISearchListByIntraId {
  name: string;
  userId: number;
}

const SlackAlarmSearchBarList = ({
  searchListById,
  searchListByChannel,
  searchWord,
  resetSearchState,
  totalLength,
  targetIndex,
}: {
  searchListById: ISearchListByIntraId[];
  searchListByChannel: ISlackChannels[];
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
      {searchListByChannel.map((item, index: number) => {
        return (
          <SearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.title}
            resetSearchState={resetSearchState}
            isTargetIndex={targetIndex === index}
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
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default SlackAlarmSearchBarList;
