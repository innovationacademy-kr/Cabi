import { useRef, useState } from "react";
import styled from "styled-components";
import { SlackAlarmTemplates, SlackChannels } from "@/assets/data/SlackAlarm";
import {
  axiosSendSlackNotificationToChannel,
  axiosSendSlackNotificationToUser,
} from "@/api/axios/axios.custom";
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

  const initializeInputandTextArea = () => {
    if (searchInput.current) searchInput.current.value = "";
    if (searchTextArea.current) searchTextArea.current.value = "";
  };

  const renderReceiverInput = (title: string) => {
    if (searchInput.current) searchInput.current.value = title;
  };

  const renderTemplateTextArea = (title: string) => {
    const template = SlackAlarmTemplates.find((template) => {
      return template.title === title;
    });
    if (searchTextArea.current)
      searchTextArea.current.value = template!.content;
  };

  const submit = async () => {
    if (!searchInput.current?.value) {
      // TODO : 보내는이 입력하라고 알리기
    } else if (!searchInput.current.value) {
      // TODO : 메세지 입력하라고 알리기
    } else
      try {
        if (searchInput.current!.value[0] === "#") {
          let channelId = SlackChannels.find((channel) => {
            return searchInput.current!.value === channel.title;
          })?.channelId;
          await axiosSendSlackNotificationToChannel(
            searchInput.current.value,
            searchTextArea.current!.value,
            channelId
          );
        } else {
          await axiosSendSlackNotificationToUser(
            searchInput.current.value,
            searchTextArea.current!.value
          );
        }
      } catch (error: any) {
        // TODO : response modal?
        // setModalTitle(error.response.data.message);
        // setModalContent(error.response.data.message);
        // setHasErrorOnResponse(true);
      } finally {
      }
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
      {SlackAlarmTemplates.map((template) => {
        return (
          <button onClick={() => renderTemplateTextArea(template.title)}>
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
        <button onClick={initializeInputandTextArea}>초기화</button>
        <button onClick={submit}>보내기</button>
      </div>
    </>
  );
};

export default SlackAlarmJ;

const ContentStyled = styled.textarea<{ isOnFocus: boolean }>`
  outline-color: ${(props) => (props.isOnFocus ? "var(--main-color)" : "")};
`;
