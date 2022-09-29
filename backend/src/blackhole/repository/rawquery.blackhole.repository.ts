import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBlackholeRepository } from './blackhole.repository';
import * as mariadb from 'mariadb';
import { UserDto } from 'src/dto/user.dto';

export class RawqueryBlackholeRepository implements IBlackholeRepository {
  private pool: mariadb.Pool;
  private logger: Logger;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.logger = new Logger(RawqueryBlackholeRepository.name);
    this.pool = mariadb.createPool({
      host: this.configService.get<string>('database.host'),
      user: this.configService.get<string>('database.user'),
      port: this.configService.get<number>('database.port'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.databaseV2'),
      dateStrings: true,
      multipleStatements: true,
    });
  }

  // FIXME: 여러모로 유저를 삭제하는건 문제가 될 수 있어 사용하지 않게될 것 같습니다.
  async deleteBlackholedUser(user_id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    const content = `
    ALTER TABLE lent DROP FOREIGN KEY lent_user_id;
    `;
    await connection.query(content).catch((err: any) => {
      throw new Error(`deleteBlackholedUser Error - ${err}`);
    });

    const content2 = `
    ALTER TABLE lent ADD CONSTRAINT lent_user_id FOREIGN KEY (lent_user_id) REFERENCES user (user_id) ON DELETE CASCADE;
    `;
    await connection.query(content2).catch((err: any) => {
      throw new Error(`deleteBlackholedUser Error - ${err}`);
    });
    const content3 = `
    DELETE FROM user WHERE user_id = '${user_id}';
    `;
    await connection.query(content3).catch((err: any) => {
      throw new Error(`deleteBlackholedUser Error - ${err}`);
    });
    if (connection) connection.end();
  }

  async updateBlackholedUser(user_id: number, intra_id: string): Promise<void> {
    const connection = await this.pool.getConnection().catch((err: any) => {
      throw new Error(`updateBlackholedUser Error - ${err}`);
    });

    const content = `
    SET @MIN_ID := (SELECT MIN(user_id) from user);
    update lent_log set log_user_id = (
      SELECT
        IF(@MIN_ID > 0, -2, @MIN_ID - 1)
    ) WHERE log_user_id = ${user_id};
    `;
    await connection
      .query(content)
      .then(() => {
        this.logger.warn(`Update lent_log info of ${intra_id}`);
      })
      .catch((err: any) => {
        throw new Error(`updateBlackholedUser Error - ${err}`);
      });

    const content2 = `
    SET @MIN_ID := (SELECT MIN(user_id) from user);
    update ban_user SET user_id = (
        SELECT
            IF(@MIN_ID > 0, -2, @MIN_ID - 1)
        ),
        intra_id = CONCAT('[BLACKHOLED]', intra_id)
    WHERE user_id = ${user_id};
    `;
    await connection
      .query(content2)
      .then(() => {
        this.logger.warn(`Update ban info of ${intra_id}`);
      })
      .catch((err: any) => {
        throw new Error(`updateBlackholedUser Error - ${err}`);
      });

    const content3 = `
    SET @MIN_ID := (SELECT MIN(user_id) from user);
    update user SET user_id = (
        SELECT
            IF(@MIN_ID > 0, -2, @MIN_ID - 1)
        ),
        intra_id = CONCAT('[BLACKHOLED]', intra_id),
        auth = 2
    WHERE user_id = ${user_id};
    `;
    await connection
      .query(content3)
      .then(() => {
        this.logger.warn(`Update user info of ${intra_id}`);
      })
      .catch((err: any) => {
        throw new Error(`updateBlackholedUser Error - ${err}`);
      });
    if (connection) connection.end();
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
            intra_id: user.intra_id,
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
