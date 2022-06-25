import schedule from "node-schedule";
import { WebClient } from "@slack/web-api";
import { slackReturnUser, slackOverdueUser } from "../../models/slackModel";
import { slackUserList, slackUser } from "../../models/types";
import dotenv from "dotenv";

const env = process.env;
if (env.USER === "ec2-user") {
  dotenv.config({ path: env.PWD + "/.env" }); //dep
} else {
  dotenv.config(); //local
}
const slackBot = new WebClient(env.SLACK_TOKEN);

//반납일 전날 슬랙 메세지 발송
const sendReturnDayBeforeMsg = async () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  let day = date.toISOString().replace(/T.+/, "");
  const message = `🗄 캐비닛 알림 🗄\n대여하신 캐비닛의 반납일은 ${day}일 입니다. 반납일 내 반납부탁드립니다.\n캐비닛 대여 서비스 바로가기  ➡️  https://cabi.42cadet.kr`;
  const intraList = await slackReturnUser(day);
  if (intraList) {
    try {
      for (let i = 0; i < intraList.length; i++) {
        const idx = slackUserList.findIndex(
          (user: slackUser) => user.name == intraList[i]
        );
        if (idx === -1) continue;
        await slackBot.chat.postMessage({
          text: message,
          channel: slackUserList[idx].id,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

//연체 5일후 슬랙 메세지 발송
const sendReturnDayAfterMsg = async () => {
  let date = new Date();
  let returnDate = new Date();
  returnDate.setDate(date.getDate() - 5);
  date.setDate(date.getDate() + 2);
  let day = date.toISOString().replace(/T.+/, "");
  let returnDay = returnDate.toISOString().replace(/T.+/, "");
  const message = `🗄 캐비닛 연체 알림 🗄\n대여하신 캐비닛이 5일 연체되었습니다. ${day}일 까지 반납하지 않을 시 캐비닛의 물품은 처분될 수 있습니다. 해당 물품에 대한 분실 시 책임지지 않습니다. \n캐비닛 대여 서비스 바로가기  ➡️  https://cabi.42cadet.kr`;
  const intraList = await slackOverdueUser(returnDay);
  if (intraList) {
    try {
      for (let i = 0; i < intraList.length; i++) {
        const idx = slackUserList.findIndex(
          (user: slackUser) => user.name == intraList[i]
        );
        if (idx === -1) continue;
        await slackBot.chat.postMessage({
          text: message,
          channel: slackUserList[idx].id,
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

//슬랙 user 리스트 생성
const slackUser = async () => {
  const res = await slackBot.users.list();
  if (res.members) {
    for (let i = 0; i < res.members.length; i++) {
      const element = res.members[i];
      if (element.id && element.name) {
        slackUserList.push({
          id: element.id,
          name: element.name,
        });
      }
    }
  }
};

//반납 시 슬랙 메세지 발송
export async function sendReturnMsg(intra_id: string) {
  const message = `🗄 캐비닛 알림 🗄\n대여하신 캐비닛이 정상 반납 완료되었습니다.\n캐비닛 대여 서비스 바로가기  ➡️  https://cabi.42cadet.kr`;
  try {
    const idx = slackUserList.findIndex(
      (user: slackUser) => user.name == intra_id
    );
    if (idx === -1) return;
    await slackBot.chat.postMessage({
      text: message,
      channel: slackUserList[idx].id,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
//대여 시 메세지 발송
export async function sendLentMsg(intra_id: string, expire_time: string) {
  const message = `🗄 캐비닛 알림 🗄\n대여하신 캐비닛의 반납일은 ${expire_time}일 입니다. 반납일 내 반납부탁드립니다.\n캐비닛 대여 서비스 바로가기  ➡️  https://cabi.42cadet.kr`;
  try {
    const idx = slackUserList.findIndex(
      (user: slackUser) => user.name == intra_id
    );
    if (idx === -1) return;
    await slackBot.chat.postMessage({
      text: message,
      channel: slackUserList[idx].id,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default async function slack() {
  await slackUser();
  const result = schedule.scheduleJob("0 9 * * *", function () {
    sendReturnDayBeforeMsg();
    sendReturnDayAfterMsg();
  });
}
