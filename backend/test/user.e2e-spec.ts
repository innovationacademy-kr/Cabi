import { BadRequestException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import TypeOrmConfigService from '../src/config/typeorm.config';
import { JwtService } from '@nestjs/jwt';
import { DataSource, QueryRunner } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { UserSessionDto } from '../src/dto/user.session.dto';
import { CabinetExtendDto } from '../src/dto/cabinet.extend.dto';
import { LentDto } from '../src/dto/lent.dto';
import { LogPagenationDto } from '../src/admin/dto/log.pagenation.dto';
import { CabinetLentLogDto } from '../src/admin/dto/cabinet.lent.log.dto';
import { log } from 'handlebars';
import { initTestDB, loadSQL } from "./utils";

describe('user module e2e test', () => {
  let app: INestApplication;
  let cookie: string[];
  let jwtService: JwtService;
  const databaseName = 'test_user_module';
  beforeAll(async () => {
    await initTestDB(databaseName);
    initializeTransactionalContext(); // ?
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TypeOrmConfigService)
      .useValue({
        createTypeOrmOptions: jest
          .spyOn(TypeOrmConfigService.prototype, 'createTypeOrmOptions')
          .mockImplementation(() => {
            return {
              type: 'mysql',
              host: '127.0.0.1',
              username: 'test_user',
              port: 3310,
              password: 'test_password',
              database: databaseName,
              entities: ['src/**/*.entity.ts'],
              synchronize: true,
              dropSchema: true,
            };
          }),
      })
      .compile();

    jwtService = new JwtService({
      secret: process.env.JWT_SECRETKEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIREIN,
      },
    });
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });
  describe('/api/my_info', () => {
    it('개인 사물함 대여 중인 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 5,
        intra_id: 'lentuser1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      expect(response).not.toBeNull();
      expect(response.body).toHaveProperty('cabinet_id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('intra_id');
      const body = {
        cabinet_id: 4,
        user_id: user.user_id,
        intra_id: user.intra_id,
      };
      expect(response.body).toMatchObject(body);
    });
    it('공유 사물함 대여 중인 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 9,
        intra_id: 'user1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      expect(response).not.toBeNull();
      expect(response.body).toHaveProperty('cabinet_id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('intra_id');
      const body = {
        cabinet_id: 10,
        user_id: user.user_id,
        intra_id: user.intra_id,
      };
      expect(response.body).toMatchObject(body);
    });
    it('사물함 대여 중이지 않은 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 8,
        intra_id: 'foreignuser',
      };
      const token = jwtService.sign(user);
      //when
      const response = await request(app.getHttpServer())
        .get('/api/my_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      expect(response).not.toBeNull();
      expect(response.body).toHaveProperty('cabinet_id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('intra_id');
      const body = {
        cabinet_id: -1,
        user_id: user.user_id,
        intra_id: user.intra_id,
      };
      expect(response.body).toMatchObject(body);
    });
    it('연체중인 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 6,
        intra_id: 'lentuser2',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      expect(response).not.toBeNull();
      expect(response.body).toHaveProperty('cabinet_id');
      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('intra_id');
      const body = {
        cabinet_id: 13,
        user_id: user.user_id,
        intra_id: user.intra_id,
      };
      expect(response.body).toMatchObject(body);
    });
  });
  describe('/api/my_lent_info', () => {
    it('사물함 대여중인 카뎃', async () => {
      // given
      const user: UserSessionDto = {
        user_id: 5,
        intra_id: 'lentuser1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      const cabinetExtendDto = {
        cabinet_id: 4,
        cabinet_num: 4,
      };
      expect(response).not.toBeNull();
      // Used to check that a JavaScript object matches a subset of the properties of an object
      expect(response.body).toMatchObject(cabinetExtendDto);
      expect(response.body).toHaveProperty('lent_info');
      expect(response.body.lent_info).toBeInstanceOf(Array);
      const lentDto = {
        intra_id: user.intra_id,
        is_expired: false,
        lent_id: 1,
        user_id: user.user_id,
      };
      expect(response.body.lent_info).toEqual(
        expect.arrayContaining([expect.objectContaining(lentDto)]),
      );
    });
    it('공유 사물함 대여 중인 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 9,
        intra_id: 'user1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      const cabinetExtendDto = {
        cabinet_id: 10,
        cabinet_num: 10,
      };
      expect(response).not.toBeNull();
      // Used to check that a JavaScript object matches a subset of the properties of an object
      expect(response.body).toMatchObject(cabinetExtendDto);
      expect(response.body).toHaveProperty('lent_info');
      expect(response.body.lent_info).toBeInstanceOf(Array);
      const lentDto = {
        intra_id: user.intra_id,
        is_expired: false,
        lent_id: 3,
        user_id: user.user_id,
      };
      expect(response.body.lent_info).toEqual(
        expect.arrayContaining([expect.objectContaining(lentDto)]),
      );
    });
    it('사물함 대여 중이지 않은 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 8,
        intra_id: 'foreignuser',
      };
      const token = jwtService.sign(user);
      //when
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info')
        .set('Authorization', `Bearer ${token}`);
      // then
      expect(response).not.toBeNull();
      // Used to check that a JavaScript object matches a subset of the properties of an object
      expect(response.status).toEqual(204);
    });
  });
  describe('/api/my_lent_info/log', () => {
    it('사물함 대여했던 카뎃', async () => {
      // given
      const user: UserSessionDto = {
        user_id: 5,
        intra_id: 'lentuser1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info/log')
        .set('Authorization', `Bearer ${token}`)
        .query({ length: 10, page: 0 });
      // then
      const oneLog = {
        cabinet_id: 4,
        cabinet_num: 4,
        floor: 4,
        intra_id: user.intra_id,
        user_id: user.user_id,
      };
      const logs = [oneLog];
      expect(response).not.toBeNull();
      expect(response.body).not.toBeNull();
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('total_length');
      expect(response.body.result).toBeInstanceOf(Array);
      expect(response.body.result).toEqual(
        expect.arrayContaining([expect.objectContaining(oneLog)]),
      );
      expect(response.body.total_length).toBeGreaterThan(0);
    });
    it('현재 사물함 대여 중이지만, 이전에 대여 이력이 없는 카뎃', async () => {
      //given
      const user: UserSessionDto = {
        user_id: 9,
        intra_id: 'user1',
      };
      const token = jwtService.sign(user);
      // when
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info/log')
        .set('Authorization', `Bearer ${token}`)
        .query({ length: 10, page: 0 });
      // then
      const oneLog = {
        cabinet_id: 10,
        cabinet_num: 10,
        intra_id: user.intra_id,
        user_id: user.user_id,
      };
      const logs = [oneLog];
      expect(response).not.toBeNull();
      expect(response.body).not.toBeNull();
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
    it('사물함 대여 이력이 없는 카뎃', async () => {
      // given
      const user: UserSessionDto = {
        user_id: 8,
        intra_id: 'foreignuser',
      };
      const token = jwtService.sign(user);
      // then
      const response = await request(app.getHttpServer())
        .get('/api/my_lent_info/log')
        .set('Authorization', `Bearer ${token}`)
        .query({ length: 0, page: 0 });
      //when
      const logs = [];
      expect(response).not.toBeNull();
      const errorResponse = {
        error: 'Bad Request',
        message: '로그가 없습니다',
        statusCode: 400,
      };
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
