import { CabinetListDto } from '../dto/cabinet-list.dto';
import { CabinetInfoDto } from '../dto/cabinet-info.dto';
import { LentInfoDto } from '../dto/lent-info.dto';
import { ConfigService } from '@nestjs/config';
import * as mariadb from 'mariadb';
import { Inject } from '@nestjs/common';
import { ICabinetRepository } from './cabinet.repository';

export class RawqueryCabinetRepository implements ICabinetRepository {
  private pool;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.pool = mariadb.createPool({
      host: this.configService.get<string>('database.host'),
      user: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
    });
  }

  async getAllCabinets(): Promise<CabinetListDto> {
    const allCabinet: CabinetListDto = {
      location: [],
      floor: [],
      section: [],
      cabinet: [],
    };
    const connection = await this.pool.getConnection();

    try {
      //location info
      const content1 = `select distinct cabinet.location from cabinet`;
      const result1 = await connection.query(content1);
      for (const element1 of result1) {
        const floorList: Array<number> = [];
        const list: Array<Array<string>> = [];
        const tmpCabinetList: Array<Array<Array<CabinetInfoDto>>> = [];
        const content2 = `select distinct cabinet.floor from cabinet where location='${element1.location}' order by floor`;
        allCabinet.location?.push(element1.location);
        //floor info with exact location
        const result2 = await connection.query(content2);
        for (const element2 of result2) {
          const sectionList: Array<string> = [];
          const cabinet: Array<Array<CabinetInfoDto>> = [];
          const content3 = `select distinct cabinet.section from cabinet where location='${element1.location}' and floor=${element2.floor}`;
          floorList.push(element2.floor);
          //section info with exact floor
          const result3 = await connection.query(content3);
          for (const element3 of result3) {
            const lastList: Array<CabinetInfoDto> = [];
            const content4 = `select * from cabinet where location='${element1.location}' and floor=${element2.floor} and section='${element3.section}' and activation=1 order by cabinet_num`;
            sectionList.push(element3.section);
            //cabinet info with exact section
            const result4 = await connection.query(content4);
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
      if (connection) connection.end();
    } catch (err) {
      console.error(err);
      throw err;
    }
    return allCabinet;
  }

  async getLentUsers(): Promise<LentInfoDto[]> {
    const lentInfo: Array<LentInfoDto> = [];
    const content = `SELECT u.intra_id, l.* FROM user u RIGHT JOIN lent l ON l.lent_user_id=u.user_id`;

    const connection = await this.pool.getConnection();
    await connection
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
    if (connection) connection.end();
    return lentInfo;
  }
}
