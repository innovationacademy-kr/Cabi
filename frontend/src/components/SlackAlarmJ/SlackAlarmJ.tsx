import { useRef, useState } from "react";
import styled from "styled-components";
import { SlackAlarmTemplate, SlackChannels } from "@/assets/data/SlackAlarm";
import useOutsideClick from "@/hooks/useOutsideClick";
import SlackAlarmSearchBar from "../TopNav/SearchBar/SlackAlarmJ/SlackAlarmSearchBar";

const SlackAlarmJ = () => {
  const [onFocus, setOnFocus] = useState(false);
  const searchTextArea = useRef<HTMLTextAreaElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  // outside click
  useOutsideClick(searchTextArea, () => {
    setOnFocus(false);
  });

  const initialTextrea = () => {
    if (searchTextArea.current) searchTextArea.current.value = "";
  };

  const renderReceiverInput = (title: string) => {
    if (searchInput.current) searchInput.current.value = title;
  };

  return (
    <>
      <h2>자주쓰는채널</h2>
      {SlackChannels.map((channel) => {
        return (
          <button onClick={() => renderReceiverInput(channel.title)}>
            {channel.title}
          </button>
        );
      })}
      <h2>자주쓰는템플릿</h2>
      {SlackAlarmTemplate.map((template) => {
        return (
          <button
          //   onClick={}
          >
            {template.title}
          </button>
        );
      })}
      <h2>알림보내기</h2>
      <div>
        <div>받는이(intraid/channel)</div>
        <SlackAlarmSearchBar searchInput={searchInput} />
        <div>메시지내용</div>
        <ContentStyled
          onFocus={() => {
            setOnFocus(true);
          }}
          ref={searchTextArea}
          isOnFocus={onFocus}
        />
        <button onClick={initialTextrea}>초기화</button>
        <button>보내기</button>
      </div>
    </>
  );
};

export default SlackAlarmJ;

const ContentStyled = styled.textarea<{ isOnFocus: boolean }>`
  outline-color: ${(props) => (props.isOnFocus ? "var(--main-color)" : "")};
`;
