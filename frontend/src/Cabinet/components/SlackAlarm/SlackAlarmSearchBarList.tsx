import styled from "styled-components";
import SlackAlarmSearchListItem from "@/Cabinet/components/SlackAlarm/SlackAlarmSearchListItem";
import { ISlackChannel } from "@/Cabinet/assets/data/SlackAlarm";

interface ISearchListByIntraId {
  name: string;
  userId: number;
}

const SlackAlarmSearchBarList = ({
  searchListById,
  searchListByChannel,
  searchWord,
  targetIndex,
  renderReceiverInput,
}: {
  searchListById: ISearchListByIntraId[];
  searchListByChannel: ISlackChannel[];
  searchWord: string;
  targetIndex?: number;
  renderReceiverInput: (title: string) => void;
}) => {
  return (
    <UlStyled>
      {searchListById.map((item, index: number) => {
        return (
          <SlackAlarmSearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.name}
            isTargetIndex={targetIndex === index}
            renderReceiverInput={renderReceiverInput}
          />
        );
      })}
      {searchListByChannel.map((item, index: number) => {
        return (
          <SlackAlarmSearchListItem
            key={index}
            inputText={searchWord}
            resultText={item.title}
            isTargetIndex={targetIndex === index}
            renderReceiverInput={renderReceiverInput}
          />
        );
      })}
    </UlStyled>
  );
};

const UlStyled = styled.ul`
  position: absolute;
  top: 50px;
  width: 100%;
  border: 1px solid var(--white-text-with-bg-color);
  border-radius: 10px;
  text-align: left;
  padding: 10px;
  color: var(--mine-text-color);
  background-color: var(--white-text-with-bg-color);
  box-shadow: 0 0 10px 0 var(--left-nav-border-shadow-color);
  opacity: 0.9;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default SlackAlarmSearchBarList;
