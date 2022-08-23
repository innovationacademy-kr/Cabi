import mariadb from "mariadb";
import { cabinetInfo, cabinetListInfo } from "./types";

const env = process.env;

const con = mariadb.createPool({
	host: env.HOST,
	user: env.DB_USER,
	port: parseInt(env.DB_PORT ? env.DB_PORT : '', 10),
	password: env.DB_PASSWORD,
	database: env.DATABASE,
	dateStrings: true,
});

export async function connectionForCabinet() : Promise<cabinetListInfo> {
  // if (cabinetList.location?.length) return;
  const allCabinet : cabinetListInfo = {
    location : [],
    floor : [],
    section : [],
    cabinet : [],
  };
  let pool: mariadb.PoolConnection;
  try {
    pool = await con.getConnection();
    //location info
    const content1: string = "select distinct cabinet.location from cabinet";
    const result1 = await pool.query(content1);
    for (const element1 of result1) {
      let floorList: Array<number> = [];
      let list: Array<Array<string>> = [];
      let tmpCabinetList: Array<Array<Array<cabinetInfo>>> = [];
      const content2: string = `select distinct cabinet.floor from cabinet where location='${element1.location}' order by floor`;

      allCabinet.location?.push(element1.location);
      //floor info with exact location
      const result2 = await pool.query(content2);
      for (const element2 of result2) {
        let sectionList: Array<string> = [];
        let cabinet: Array<Array<cabinetInfo>> = [];
        const content3: string = `select distinct cabinet.section from cabinet where location='${element1.location}' and floor=${element2.floor}`;
        floorList.push(element2.floor);
        //section info with exact floor
        const result3 = await pool.query(content3);
        for (const element3 of result3) {
          let lastList: Array<cabinetInfo> = [];
          const content4: string = `select * from cabinet where location='${element1.location}' and floor=${element2.floor} and section='${element3.section}' and activation=1 order by cabinet_num`;

          sectionList.push(element3.section);
          //cabinet info with exact section
          const result4 = await pool.query(content4);
          for (const element4 of result4) {
            lastList.push(element4);
          }
          cabinet.push(lastList);
        }
        list.push(sectionList);
        tmpCabinetList.push(cabinet);
      }
      allCabinet.floor?.push(floorList);
      allCabinet.section?.push(list);
      allCabinet.cabinet?.push(tmpCabinetList);
    }
    if (pool) pool.end();
  } catch (err) {
    console.error(err);
    throw err;
  }
  return allCabinet;
}
