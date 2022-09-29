import * as mariadb from 'mariadb';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { IEmailRepository } from './email.repository.interface';

export class RawqueryEmailRepository implements IEmailRepository {
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
