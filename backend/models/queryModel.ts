import mariadb from "mariadb";
import { lentInfo, lentCabinetInfo, userInfo, user } from "./types";
import { sendLentMsg, sendReturnMsg } from "../controllers/middleware/slackMiddleware";

export const con = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "42cabi_DB",
  dateStrings: true,
});

//사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
export async function checkUser(user: userInfo) {
  let pool: mariadb.PoolConnection;
  let lentCabinet: lentCabinetInfo;
  const content: string = `SELECT * FROM user WHERE user_id = ${user.user_id}`;

  try {
    pool = await con.getConnection();
    lentCabinet = await pool.query(content).then(async (res: any) => {
      if (!res.length) {
        addUser(user); // 사용자가 없는 경우, user 값 생성
        return {
          lent_id: -1,
          lent_cabinet_id: -1,
          lent_user_id: -1,
          lent_time: "",
          expire_time: "",
          extension: false,
          cabinet_num: -1,
          location: "",
          floor: -1,
          section: "",
          activation: false,
        };
      } else {
        await updateUser(user);
        return await getUser(user); //본인 정보 및 렌트 정보 - 리턴 페이지
      }
    });
  } catch (err: any) {
    console.error(err);
    throw err;
  }
  if (pool) pool.end();
  return lentCabinet;
}

//사용자가 없는 경우, user 값 생성
export async function addUser(user: userInfo) {
  let pool: mariadb.PoolConnection;
  const content: string = `INSERT INTO user value('${user.user_id}', '${user.intra_id}', 0, '${user.email}', '', now(), now())`;

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      // console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
}

//본인 정보 및 렌트 정보 - 리턴 페이지
export async function getUser(user: userInfo): Promise<lentCabinetInfo> {
  let pool: mariadb.PoolConnection;
  let lentCabinet: lentCabinetInfo;
  const content: string = `SELECT * FROM lent l JOIN cabinet c ON l.lent_cabinet_id=c.cabinet_id WHERE l.lent_user_id='${user.user_id}'`;

  pool = await con.getConnection();
  lentCabinet = await pool
    .query(content)
    .then((res: any) => {
      if (res.length !== 0) {
        // lent page
        return {
          lent_id: res[0].lent_id,
          lent_cabinet_id: res[0].lent_cabinet_id,
          lent_user_id: res[0].lent_user_id,
          lent_time: res[0].lent_time,
          expire_time: res[0].expire_time,
          extension: res[0].extension,
          cabinet_num: res[0].cabinet_num,
          location: res[0].location,
          floor: res[0].floor,
          section: res[0].section,
          activation: res[0].activation,
        };
      } else {
        return {
          lent_id: -1,
          lent_cabinet_id: -1,
          lent_user_id: -1,
          lent_time: "",
          expire_time: "",
          extension: false,
          cabinet_num: -1,
          location: "",
          floor: -1,
          section: "",
          activation: false,
        };
      }
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
  return lentCabinet;
}

//lent & user
export async function getLentUser() {
  let pool: mariadb.PoolConnection;
  let lentInfo: Array<lentInfo> = [];
  const content =
    "SELECT u.intra_id, l.* FROM user u RIGHT JOIN lent l ON l.lent_user_id=u.user_id";

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      for (let i = 0; i < res.length; i++) {
        lentInfo.push({
          lent_id: res[i].lent_id,
          lent_cabinet_id: res[i].lent_cabinet_id,
          lent_user_id: res[i].lent_user_id,
          lent_time: res[i].lent_time,
          expire_time: res[i].expire_time,
          extension: res[i].extension,
          intra_id: res[i].intra_id,
        });
      }
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
  return { lentInfo: lentInfo };
}

//lent 값 생성
export async function createLent(cabinet_id: number, user: userInfo) {
  let errResult = 0;
  let pool: mariadb.PoolConnection;
  const content: string = `INSERT INTO lent (lent_cabinet_id, lent_user_id, lent_time, expire_time, extension) VALUES (${cabinet_id}, ${user.user_id}, now(), ADDDATE(now(), 30), 0)`;
  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      if (res) {
        let date = new Date();
        date.setDate(date.getDate() + 7);
        let day = date.toISOString().replace(/T.+/, "");
        sendLentMsg(user.intra_id, day); // 슬랙 메시지 발송
      }
    })
    .catch((err: any) => {
      if (err.errno === 1062) errResult = -1;
    });
  if (pool) pool.end();
  return { errno: errResult };
}

//lent_log 값 생성 후 lent 값 삭제
export async function createLentLog(user: user) {
  let pool: mariadb.PoolConnection;
  const content: string = `SELECT * FROM lent WHERE lent_user_id=${user.user_id}`;

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      if (res[0] === undefined) return;
      pool.query(
        `INSERT INTO lent_log (log_user_id, log_cabinet_id, lent_time, return_time) VALUES (${res[0].lent_user_id}, ${res[0].lent_cabinet_id}, '${res[0].lent_time}', now())`
      );
      pool.query(
        `DELETE FROM lent WHERE lent_cabinet_id=${res[0].lent_cabinet_id}`
      );
      sendReturnMsg(user.intra_id);
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
}

export async function activateExtension(user: any) {
  let pool: mariadb.PoolConnection;
  const content: string = `SELECT * FROM lent WHERE lent_user_id=${user.user_id}`;

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      if (res[0] === undefined) {
        return;
      }
      const content2: string = `UPDATE lent set extension=${
        res[0].extension + 1
      }, expire_time=ADDDATE(now(), 7) WHERE lent_user_id=${user.user_id}`;
      pool.query(content2);
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
}

export async function updateUser(user: userInfo) {
  let pool: mariadb.PoolConnection;
  const content = `UPDATE user SET lastLogin=now() WHERE user_id=${user.user_id}`;

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      // console.log(res);
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
}

// 해당 유저가 Ban처리 되어있는지 확인
export async function checkBannedUserList(user_id: number) {
  let pool: mariadb.PoolConnection;
  const content: string = `SELECT * FROM user WHERE user_id=${user_id}`;
  let isBanned = 0;

  pool = await con.getConnection();
  await pool
    .query(content)
    .then((res: any) => {
      isBanned = res[0].auth;
    })
    .catch((err: any) => {
      console.error(err);
      throw err;
    });
  if (pool) pool.end();
  return isBanned;
}

export async function checkCabinetStatus(cabinet_id: number) {
  try {
    const content = `SELECT activation FROM cabinet WHERE cabinet_id=${cabinet_id}`;
    const pool = await con.getConnection();
    const cabinet = await pool.query(content);

    if (pool) pool.end();
    if (cabinet[0].activation === 1) {
      return 1;
    }
  } catch (err :any) {
    const error = new Error(err.message);
    error.name = 'CheckCabinetStatusError';
    console.error(error);
    throw error;
  }
  return 0;
}