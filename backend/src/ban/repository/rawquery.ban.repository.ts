import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBanRepository } from './ban.repository';
import * as mariadb from 'mariadb';
import { OverUserDto } from '../dto/over.user.dto';
import { BanUserDto } from '../dto/ban.user.dto';

export class RawqueryBanRepository implements IBanRepository {
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

  /**
   * n일 이상 연체자 조회
   * @param days 연체일
   * @return userInfoDto 리스트 or undefined
   */
  async getOverUser(days: number): Promise<OverUserDto[] | undefined> {
    // const pool: mariadb.PoolConnection = await this.con.getConnection();
    const connection = await this.pool.getConnection();
    let overUserList: OverUserDto[] | undefined = [];
    const content = `
		SELECT  u.*, l.lent_id, l.lent_cabinet_id
		FROM user u RIGHT OUTER JOIN lent l ON u.user_id = l.lent_user_id
		WHERE DATEDIFF(now(), expire_time) = ${days}`;

    await connection
      .query(content)
      .then((res: any) => {
        if (!res.length) overUserList = undefined;
        else {
          res.forEach((user: any) => {
            overUserList?.push({
              user_id: user.user_id,
              intra_id: user.intra_id,
              auth: user.auth,
              email: user.email,
              lent_id: user.lent_id,
              cabinet_id: user.lent_cabinet_id,
            });
          });
        }
      })
      .catch((err) => {
        throw new Error(`getOverUser Error - ${err}`);
      });
    if (connection) connection.end();
    return overUserList;
  }

  /**
   * 유저 권한 ban(1) 으로 변경
   * @param userId 유저 PK
   */
  async updateUserAuth(userId: number): Promise<void> {
    // const pool: mariadb.PoolConnection = await this.con.getConnection();
    const connection = await this.pool.getConnection();
    const content = `
		UPDATE user SET auth = 1 WHERE user_id = ${userId};
		`;

    await connection.query(content).catch((err: any) => {
      throw new Error(`updateUserAuth Error - ${err}`);
    });
    if (connection) connection.end();
  }

  /**
   * 캐비넷 activation 변경
   * @param cabinetId 캐비넷 PK
   * @param activation 캐비넷 상태 값
   */
  async updateCabinetActivation(
    cabinetId: number,
    activation: number,
  ): Promise<void> {
    const connection = await this.pool.getConnection();
    const content = `
			UPDATE cabinet SET activation = ${activation} WHERE cabinet_id = ${cabinetId}
		`;

    await connection.query(content).catch((err: any) => {
      throw new Error(`updateCabinetActivation Error - ${err}`);
    });
    if (connection) connection.end();
  }

  /**
   * banUser 추가
   * @param banUser 추가될 유저 정보
   */
  async addBanUser(banUser: BanUserDto) {
    const connection = await this.pool.getConnection();
    const cabinet_id = banUser.cabinet_id ? banUser.cabinet_id : 'NULL';
    const content = `
		INSERT INTO ban_user(user_id, intra_id, cabinet_id, bannedDate)
		values (${banUser.user_id}, '${banUser.intra_id}', ${cabinet_id}, now());
		`;

    await connection.query(content).catch((err: any) => {
      throw new Error(`CheckBanUser Error - ${err}`);
    });
    if (connection) connection.end();
  }

  /**
   * 해당 유저가 Ban처리 되어있는지 확인
   * @param user_id 추가될 유저의 id
   */
  async checkBannedUserList(user_id: number): Promise<number> {
    const connection = await this.pool.getConnection();
    const content = `SELECT * FROM user WHERE user_id=${user_id}`;
    let isBanned = 0;

    await connection
      .query(content)
      .then((res: any) => {
        isBanned = res[0].auth;
      })
      .catch((err: any) => {
        throw err;
      });
    if (connection) connection.end();
    return isBanned;
  }
}
