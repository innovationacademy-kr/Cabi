import { useState } from "react";
import { SlackAlarmTemplate, SlackChannels } from "@/assets/data/SlackAlarm";
import SlackAlarmSearchBar from "../TopNav/SearchBar/SlackAlarmJ/SlackAlarmSearchBar";

const SlackAlarmJ = () => {
  const [onFocus, setOnFocus] = useState(false);

  console.log("onFocus : ", onFocus);
  return (
    <>
      <h2>자주쓰는채널</h2>
      {SlackChannels.map((channel) => {
        return <button>{channel.title}</button>;
      })}
      <h2>자주쓰는템플릿</h2>
      {SlackAlarmTemplate.map((template) => {
        return <button>{template.title}</button>;
      })}
      <h2>알림보내기</h2>
      <div>
        <div>받는이(intraid/channel)</div>
        <SlackAlarmSearchBar />
        <div>메시지내용</div>
        <textarea
          onFocus={() => {
            setOnFocus(true);
          }}
        ></textarea>
        <button>초기화</button>
        <button>보내기</button>
      </div>
    </>
  );
};

export default SlackAlarmJ;
