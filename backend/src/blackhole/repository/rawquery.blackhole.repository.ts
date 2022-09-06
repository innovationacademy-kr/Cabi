import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IBlackholeRepository } from './blackhole.repository';
import * as mariadb from 'mariadb';

export class RawqueryBlackholeRepository implements IBlackholeRepository {
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
}
