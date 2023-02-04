import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import TypeOrmConfigService from 'src/config/typeorm.config';
import { DataSource, QueryRunner } from 'typeorm';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { initializeTransactionalContext } from 'typeorm-transactional';

/**
 * SQL 파일을 읽어서 쿼리를 실행하는 함수
 * @param queryRunner
 * @param filePath
 */
async function loadSQL(queryRunner: QueryRunner, filePath: string) {
  const sql = require('fs').readFileSync(filePath, 'utf8');
  const commands = sql.split(';');

  for (const command of commands) {
    if (command.trim()) {
      await queryRunner.query(command);
    }
  }
}

describe('Main Lent 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  /**
   * 테스트 전에 한 번만 실행되는 함수
   * typeorm-transactional를 초기화합니다.
   * AppModule을 불러와 TestModule을 생성합니다.
   * TypeOrmConfigService를 override하여 테스트용 DB에 연결되도록 합니다.
   */
  beforeAll(async () => {
    initializeTransactionalContext();
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
              port: 3306,
              password: 'test_password',
              database: 'test_db',
              entities: ['src/**/*.entity.ts'],
              synchronize: true,
              dropSchema: true,
            };
          }),
      })
      .compile();

    // jwt 토큰 발행을 위해 JwtService를 인스턴스화합니다.
    jwtService = new JwtService({
      secret: process.env.JWT_SECRETKEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIREIN,
      },
    });

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /**
   * 각각의 테스트가 실행되기 전에 실행됩니다.
   * 테스트용 DB의 샘플 데이터를 초기화합니다.
   */
  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });

  it('db 연동 테스트', () => {
    // app이 정상적으로 인스턴스화되는지 확인
    expect(app).toBeDefined();
  });

  describe('/api/lent/:cabinet_id (POST)', () => {
    describe('정상적인 요청 - 대여에 성공합니다.', () => {
      it('PRIVATE & AVAILABLE', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(201);
      });

      it('SHARE & AVAILABLE', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // SHARE & AVAILABLE 사물함
        const cabinetId = 5;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(201);
      });

      it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 1명)', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // SHARE & SET_EXPIRE_AVAILABLE 사물함
        const cabinetId = 9;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(201);
      });

      it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 2명)', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // SHARE & SET_EXPIRE_AVAILABLE 사물함
        const cabinetId = 11;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(201);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
