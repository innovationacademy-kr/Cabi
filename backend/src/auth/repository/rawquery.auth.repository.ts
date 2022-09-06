import { lentCabinetInfoDto } from 'src/cabinet/dto/cabinet-lent-info.dto';
import { UserSessionDto } from '../dto/user.session.dto';
import { IAuthRepository } from './auth.repository';
import * as mariadb from 'mariadb';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

export class RawqueryAuthRepository implements IAuthRepository {
  private pool;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.pool = mariadb.createPool({
      host: this.configService.get<string>('database.host'),
      user: this.configService.get<string>('database.user'),
      port: this.configService.get<number>('database.port'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.database'),
      dateStrings: true,
    });
  }

  //사용자 확인 - 사용자가 없는 경우, addUser, 있는 경우, getUser
  async checkUser(user: UserSessionDto): Promise<lentCabinetInfoDto> {
    let lentCabinet: lentCabinetInfoDto;
    const content = `SELECT * FROM user WHERE user_id = ${user.user_id}`;

    try {
      const connection = await this.pool.getConnection();
      lentCabinet = await connection.query(content).then(async (res: any) => {
        if (!res.length) {
          this.addUser(user); // 사용자가 없는 경우, user 값 생성
          return {
            lent_id: -1,
            lent_cabinet_id: -1,
            lent_user_id: -1,
            lent_time: '',
            expire_time: '',
            extension: false,
            cabinet_num: -1,
            location: '',
            floor: -1,
            section: '',
            activation: false,
          };
        } else {
          await this.updateUser(user);
          return await this.getUser(user); //본인 정보 및 렌트 정보 - 리턴 페이지
        }
      });
      if (connection) connection.end();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
    return lentCabinet;
  }

  //사용자가 없는 경우, user 값 생성
  async addUser(user: UserSessionDto): Promise<void> {
    const content = `INSERT INTO user value('${user.user_id}', '${user.intra_id}', 0, '${user.email}', '', now(), now())`;

    const connection = await this.pool.getConnection();
    await connection.query(content).catch((err: any) => {
      console.error(err);
      throw err;
    });
    if (connection) connection.end();
  }

  async updateUser(user: UserSessionDto): Promise<void> {
    const content = `UPDATE user SET lastLogin=now() WHERE user_id=${user.user_id}`;

    const connection = await this.pool.getConnection();
    await connection.query(content).catch((err: any) => {
      console.error(err);
      throw err;
    });
    if (connection) connection.end();
  }

  //본인 정보 및 렌트 정보 - 리턴 페이지
  async getUser(user: UserSessionDto): Promise<lentCabinetInfoDto> {
    const content = `SELECT * FROM lent l JOIN cabinet c ON l.lent_cabinet_id=c.cabinet_id WHERE l.lent_user_id='${user.user_id}'`;

    const connection = await this.pool.getConnection();
    const lentCabinet: lentCabinetInfoDto = await connection
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
            lent_time: '',
            expire_time: '',
            extension: false,
            cabinet_num: -1,
            location: '',
            floor: -1,
            section: '',
            activation: false,
          };
        }
      })
      .catch((err: any) => {
        console.error(err);
        throw err;
      });
    if (connection) connection.end();
    return lentCabinet;
  }

  async getAllUser(): Promise<UserDto[]> {
    const content = `SELECT * FROM user;`;

    const userList: UserDto[] = [];
    const connection = await this.pool.getConnection();
    await connection
      .query(content)
      .then((res: any) => {
        res.forEach((user: any) => {
          userList.push({
            user_id: user.user_id,
            intra_id: user.intra_id
          });
        });
      })
      .catch((err: any) => {
        console.error(err);
        throw err;
      });
    if (connection) connection.end();
    return userList;
  }
}
