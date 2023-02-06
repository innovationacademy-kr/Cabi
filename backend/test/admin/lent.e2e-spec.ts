import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import TypeOrmConfigService from 'src/config/typeorm.config';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initTestDB, loadSQL } from '../utils';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';

/**
 * 실제 테스트에 사용할 DB 이름을 적습니다.
 * 테스트 파일들이 각각 병렬적으로 실행되므로, DB 이름을 다르게 설정해야 합니다.
 */
const testDBName = 'test_admin_lent';

describe('Admin Lent 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  /**
   * 테스트 전에 한 번만 실행되는 함수
   * typeorm-transactional를 초기화합니다.
   * AppModule을 불러와 TestModule을 생성합니다.
   * TypeOrmConfigService를 override하여 테스트용 DB에 연결되도록 합니다.
   */
  beforeAll(async () => {
    await initTestDB(testDBName);
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
              port: 3310,
              password: 'test_password',
              database: testDBName,
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

  describe('/api/admin/lent/:cabinetId/:userId (POST)', () => {
    describe('정상적인 요청 - 대여에 성공합니다.', () => {
      it('PRIVATE & AVAILABLE 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const userId = 2;
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(201);
        // TODO: 사물함의 상태가 SET_EXPIRE_FULL로 변경되는지 확인
        // TODO: lent 테이블에 대여 기록이 추가되는지 확인
      });
    });

    describe('비정상적인 요청 - 관리자 권한이 없는 경우', () => {
      it('관리자 권한이 없는 유저의 대여 요청인 경우', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const userId = 2;
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = 'invalid_token';

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(401);
      });
    });

    describe('비정상적인 요청 - 존재하지 않는 사물함 혹은 유저', () => {
      it('존재하지 않는 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const userId = 2;
        // 존재하지 않는 사물함
        const cabinetId = 99999;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 400이 응답되어야 하는데, 500이 응답됨
        //        그러나 409를 응답하도록 하는 것이 적절해보임.
        expect(response.status).toBe(500);
      });

      it('존재하지 않는 유저 ID로 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 존재하지 않는 유저
        const userId = 99999;
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 400이 응답되어야 하는데, 500이 응답됨
        // FIXME: 그러나 409를 응답하도록 하는 것이 적절해보임.
        expect(response.status).toBe(500);
      });
    });

    describe('비정상적인 요청 - 이미 대여중인 사물함이 있는 경우', () => {
      it('PRIVATE & AVAILABLE 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 5;
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
        expect(response.status).toBe(400);
      });
    });

    // TODO: 관리자가 사용하는 API이므로 연체 사물함이나 임시 밴, 고장 사물함 대여 요청을
    //       정상적인 것으로 처리로 할 지 추후 논의가 필요할 것 같습니다.
    describe('비정상적인 요청 - 이용 불가능한 사물함을 대여한 경우', () => {
      it('BANNED 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // BANNED 사물함
        const cabinetId = 7;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      it('EXPIRED 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // EXPIRED 사물함
        const cabinetId = 14;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      it('BROKEN 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // BROKEN 사물함
        const cabinetId = 6;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });
    });

    describe('비정상적인 요청 - 잔여 자리가 없는 경우', () => {
      it('PRIVATE & SET_EXPIRE_FULL 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // PRIVATE & SET_EXPIRE_FULL 사물함
        const cabinetId = 4;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(409);
      });
    });

    describe('비정상적인 요청 - 동아리 사물함을 대여 시도한 경우', () => {
      it('CLUB & SET_EXPIRE_FULL 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // CLUB & SET_EXPIRE_FULL 사물함
        const cabinetId = 12;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(409);
      });

      it('CLUB & AVAILABLE 사물함을 대여 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const userId = 2;
        // CLUB & AVAILABLE 사물함
        const cabinetId = 15;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/admin/lent/cabinet/${cabinetId}/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(418);
      });
    });
  });

  afterAll(async () => {
    app.close();
  });
});
