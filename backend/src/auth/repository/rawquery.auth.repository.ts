import { LentCabinetInfoDto } from 'src/cabinet/dto/cabinet.lent.info.dto';
import { IAuthRepository } from './auth.repository.interface';
import * as mariadb from 'mariadb';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';

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

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    const findQuery = `SELECT * FROM user WHERE user_id = ${user.user_id}`;
    const insertQuery = `INSERT INTO user value('${user.user_id}', '${user.intra_id}', 0, '${user.email}', '', now(), now(), 0)`;

    const connection = await this.pool.getConnection();
    connection.beginTransaction();
    try {
      const result = await connection.query(findQuery);

      if (result.length === 0) {
        await connection.query(insertQuery);
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      connection.rollback();
      return false;
    } finally {
      connection.commit();
      connection.release();
    }
  }
  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    const query = `SELECT * FROM lent WHERE lent_user_id = ${user.user_id}`;
    const connection = await this.pool.getConnection();
    const result = await connection.query(query);
    if (connection) connection.end();
    return result > 0;
  }
}
