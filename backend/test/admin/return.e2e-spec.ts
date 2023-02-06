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
const testDBName = 'test_admin_return';

describe('Admin Return 모듈 테스트 (e2e)', () => {
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

  describe('/api/admin/return/cabinet/:cabinetId (DELETE)', () => {
    describe('정상적인 요청 - 반납에 성공합니다.', () => {
      it('PRIVATE & SET_EXPIRE_FULL 사물함을 반납 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // PRIVATE & SET_EXPIRE_FULL 사물함
        const cabinetId = 13;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .delete(`/api/admin/return/cabinet/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 204가 응답되야 하는데 200이 응답됨
        expect(response.status).toBe(200);
        // TODO: 사물함의 상태가 AVAILABLE로 변경되는지 확인
        // TODO: lent가 삭제되었는지 확인
        // TODO: lent_log가 생성되었는지 확인
      });

      it('SHARE & SET_EXPIRE_FULL 사물함을 반납 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // SHARE & SET_EXPIRE_FULL 사물함
        const cabinetId = 8;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .delete(`/api/admin/return/cabinet/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 204가 응답되야 하는데 200이 응답됨
        expect(response.status).toBe(200);
        // TODO: 사물함의 상태가 AVAILABLE로 변경되는지 확인
        // TODO: lent가 삭제되었는지 확인
        // TODO: lent_log가 생성되었는지 확인
      });

      it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 2명) 반납 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // SHARE & SET_EXPIRE_AVAILABLE 사물함
        const cabinetId = 11;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .delete(`/api/admin/return/cabinet/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 204가 응답되야 하는데 200이 응답됨
        expect(response.status).toBe(200);
        // TODO: 사물함의 상태가 AVAILABLE로 변경되는지 확인
        // TODO: lent가 삭제되었는지 확인
        // TODO: lent_log가 생성되었는지 확인
      });

      it('PRIVATE & EXPIRED 반납 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // PRIVATE & EXPIRED 사물함
        const cabinetId = 13;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .delete(`/api/admin/return/cabinet/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 204가 응답되야 하는데 200이 응답됨
        expect(response.status).toBe(200);
        // TODO: 사물함의 상태가 AVAILABLE로 변경되는지 확인
        // TODO: lent가 삭제되었는지 확인
        // TODO: lent_log가 생성되었는지 확인
        // TODO: ban_log가 생성되었는지 확인
      });

      it('SHARE & EXPIRED(대여 중인 사람이 1명) 반납 시도', async () => {
        // given
        // 승인받은 관리자 유저
        const adminUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        // SHARE & EXPIRED 사물함
        const cabinetId = 14;
        const token = jwtService.sign(adminUser);

        // when
        const response = await request(app.getHttpServer())
          .delete(`/api/admin/return/cabinet/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        // FIXME: 204가 응답되야 하는데 200이 응답됨
        expect(response.status).toBe(200);
        // TODO: 사물함의 상태가 AVAILABLE로 변경되는지 확인
        // TODO: lent가 삭제되었는지 확인
        // TODO: lent_log가 생성되었는지 확인
        // TODO: ban_log가 생성되었는지 확인
      });

      describe('비정상적인 요청', () => {
        it('존재하지 않는 사물함을 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // 존재하지 않는 사물함
          const cabinetId = 99999;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/cabinet/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
        });

        it('대여중인 유저가 없는 사물함을 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // PRIVATE & AVAILABLE 사물함
          const cabinetId = 1;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/cabinet/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
        });
      });
    });

    describe('/api/admin/return/user/:userId (DELETE)', () => {
      describe('정상적인 요청 - 반납에 성공합니다.', () => {
        it('PRIVATE & SET_EXPIRE_FULL 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // PRIVATE & SET_EXPIRE_FULL 사물함을 빌린 유저
          const userId = 5;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 204가 응답되야 하는데 200이 응답됨
          expect(response.status).toBe(200);
          // TODO: 사물함의 상태가 AVAILABLE로 변경되었는지 확인
          // TODO: lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          // TODO: lent_log가 생성되었는지 확인
        });

        it('SHARE & SET_EXPIRE_FULL 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // SHARE & SET_EXPIRE_FULL 사물함을 빌린 유저
          const userId = 13;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 204가 응답되야 하는데 200이 응답됨
          expect(response.status).toBe(200);
          // TODO: 사물함의 상태가 AVAILABLE로 변경되었는지 확인
          // TODO: lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          // TODO: lent_log가 생성되었는지 확인
        });
      });

      describe('비정상적인 요청', () => {
        it('존재하지 않는 유저로 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // 존재하지 않는 유저
          const userId = 99999;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
        });

        it('대여중인 사물함이 없는 유저로 반납 시도', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // 대여중인 사물함이 없는 유저
          const userId = 2;
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/user/${userId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
        });
      });
    });

    describe('/api/admin/return/bundle/cabinet (DELETE)', () => {
      describe('일괄 반납에 부분 성공합니다.', () => {
        it('전체 사물함을 반납합니다.', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // 전체 사물함
          const cabinets: number[] = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          ];
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/bundle/cabinet`)
            .set('Authorization', `Bearer ${token}`)
            .send({ cabinets: cabinets });
          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
          expect(response.body.user_failures.length).toBe(0);
          // cabinet_failures에는 1, 5을 제외한 배열이 들어가야 함.
          expect(response.body.cabinet_failures.length).toBe(8);
          expect(response.body.cabinet_failures).toEqual(
            expect.arrayContaining([1, 2, 3, 5, 6, 7, 12, 15]),
          );
        });

        it('전체 유저를 반납합니다.', async () => {
          // given
          // 승인받은 관리자 유저
          const adminUser: AdminUserDto = {
            email: 'normal@example.com',
            role: 1,
          };
          // 전체 유저
          const users: number[] = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
          ];
          const token = jwtService.sign(adminUser);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/admin/return/bundle/cabinet`)
            .set('Authorization', `Bearer ${token}`)
            .send({ users: users });
          // then
          // FIXME: 400이 응답되고 있지만, 409를 응답하도록 하는 것이 적절해보임.
          expect(response.status).toBe(400);
          expect(response.body.cabinet_failures.length).toBe(0);
          // cabinet_failures에는 1, 5을 제외한 배열이 들어가야 함.
          expect(response.body.user_failures.length).toBe(6);
          expect(response.body.user_failures).toEqual(
            expect.arrayContaining([1, 2, 3, 4, 7, 8]),
          );
        });

        describe('일괄 반납에 부분 성공합니다.', () => {
          it('반납에 성공하게 되는 사물함들만 반납 요청', async () => {
            // given
            // 승인받은 관리자 유저
            const adminUser: AdminUserDto = {
              email: 'normal@example.com',
              role: 1,
            };
            // 반납에 성공하게 되는 사물함
            const cabinets: number[] = [4, 8, 9, 10, 11, 13, 14];
            const token = jwtService.sign(adminUser);

            // when
            const response = await request(app.getHttpServer())
              .delete(`/api/admin/return/bundle/cabinet`)
              .set('Authorization', `Bearer ${token}`)
              .send({ cabinets: cabinets });
            // then
            // FIXME: 204가 응답되어야 하는데, 200이 응답되고 있음.
            expect(response.status).toBe(200);
          });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
