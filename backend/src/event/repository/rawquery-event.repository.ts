import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventInfoDto } from '../dto/event.info.dto';
import { IEventRepository } from './IEventRepository';
import * as mariadb from 'mariadb';

export class RawqueryEventRepository implements IEventRepository {
  private pool;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    this.pool = mariadb.createPool({
      host: this.configService.get<string>('database.host'),
      user: this.configService.get<string>('database.user'),
      port: this.configService.get<number>('database.port'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.databaseV2'),
      dateStrings: true,
    });
  }
  // 유저 & 짝 유저의 event 정보 return
  async getEventInfo(intra_id: string): Promise<EventInfoDto[]> {
    const connection = await this.pool.getConnection();
    const eventInfo = [];

    const selectContent = `select b.* from (select * from event where intra_id="${intra_id}") as a, event as b where b.event_id = a.event_id or b.event_id = a.event_id + if(a.event_id % 2 = 0, - 1, + 1)`;
    const getEventInfo = await connection.query(selectContent, intra_id);
    for (let i = 0; i < getEventInfo.length; i++) {
      eventInfo.push({
        event_id: getEventInfo[i].event_id,
        event_name: getEventInfo[i].event_name,
        intra_id: getEventInfo[i].intra_id,
        is_event: getEventInfo[i].isEvent,
      });
    }
    if (connection) connection.end();
    return eventInfo;
  }

  // 이벤트 유저 추가
  async insertEventInfo(intra_id: string): Promise<void> {
    const connection = await this.pool.getConnection();

    const checkContent = `select count(*) as count from event where intra_id="${intra_id}"`;
    const insertContent = `update event as a, (select * from event where isEvent=false limit 1) as b set a.isEvent=true, a.intra_id="${intra_id}" where a.event_id = b.event_id`;
    const checkEventUser = await connection.query(checkContent, intra_id);
    if (!checkEventUser) {
      await connection.query(insertContent, intra_id);
    }
    if (connection) connection.end();
  }

  // 이벤트 정보 업데이트
  async updateEventInfo(intra_id: string): Promise<void> {
    const connection = await this.pool.getConnection();

    const checkContent = `select count(*) as count from event where intra_id="${intra_id}"`;
    const updateContent = `update 42cabi_DB.event set intra_id = NULL, isEvent=false where intra_id="${intra_id}"`;

    const updateEventInfo = await connection.query(checkContent, intra_id);
    if (updateEventInfo) {
      await connection.query(updateContent, intra_id);
    }
    if (connection) connection.end();
  }

  // 이벤트 정보
  async checkEventInfo(intra_id: string): Promise<boolean> {
    const connection = await this.pool.getConnection();

    const selectContent = `select count(*) as count from 42cabi_DB.event where intra_id="${intra_id}"`;

    const checkEventInfo = await connection.query(selectContent, intra_id);
    if (connection) connection.end();
    if (checkEventInfo) {
      return true;
    }
    return false;
  }

  // 이벤트 당첨 가능 여부
  async checkEventLimit(): Promise<boolean> {
    const connection = await this.pool.getConnection();

    const selectContent = `select count(*) as count from 42cabi_DB.event where isEvent=0`;
    const checkEventInfo = await connection.query(selectContent);

    if (connection) connection.end();
    if (checkEventInfo) {
      return true;
    }
    return false;
  }
}
