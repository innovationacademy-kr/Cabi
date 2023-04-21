import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import TypeOrmConfigService from 'src/config/typeorm.config';
import { DataSource } from 'typeorm';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initTestDB, loadSQL } from '../utils';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { LentTools } from 'src/lent/lent.component';
import { BanService } from 'src/ban/ban.service';
/* eslint-disable */
const timekeeper = require('timekeeper');

/**
 * 실제 테스트에 사용할 DB 이름을 적습니다.
 * 테스트 파일들이 각각 병렬적으로 실행되므로, DB 이름을 다르게 설정해야 합니다.
 */
const testDBName = 'test_main_lent';

describe('Main Lent 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let cabinetInfoService: CabinetInfoService;
  let lentComponent: LentTools;
  let banService: BanService;

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
    cabinetInfoService = app.get(CabinetInfoService);
    lentComponent = app.get(LentTools);
    banService = app.get(BanService);
  });

  /**
   * 각각의 테스트가 실행되기 전에 실행됩니다.
   * 테스트용 DB의 샘플 데이터를 초기화합니다.
   */
  beforeEach(async () => {
    timekeeper.freeze(new Date('2023-01-15T00:00:00Z'));
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });

  afterEach(() => {
    timekeeper.reset();
  });

  describe('/api/lent/:cabinet_id (POST)', () => {
    describe('정상적인 요청 - 대여에 성공합니다.', () => {
      it('PRIVATE & AVAILABLE 사물함을 대여 시도', async () => {
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
        // // 사물함의 상태가 SET_EXPIRE_FULL로 변경되는지 확인
        const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);
        expect(cabinetInfo.status).toBe(CabinetStatusType.SET_EXPIRE_FULL);
        // // lent 테이블에 대여 기록이 추가되는지 확인
        expect(await lentComponent.getLentCabinetId(user.user_id)).toBe(
          cabinetId,
        );
      });

      it('SHARE & AVAILABLE 사물함을 대여 시도', async () => {
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
        // // 사물함의 상태가 AVAILABLE 변경되는지 확인
        const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);
        expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
        // // lent 테이블에 대여 기록이 추가되는지 확인
        expect(await lentComponent.getLentCabinetId(user.user_id)).toBe(
          cabinetId,
        );
      });

      it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 1명) 사물함을 대여 시도', async () => {
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
        // // 사물함의 상태가 SET_EXPIRE_AVAILABLE로 유지되는지 확인
        const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);
        expect(cabinetInfo.status).toBe(CabinetStatusType.SET_EXPIRE_AVAILABLE);
        // // lent 테이블에 대여 기록이 추가되는지 확인
        expect(await lentComponent.getLentCabinetId(user.user_id)).toBe(
          cabinetId,
        );
      });

      it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 2명) 사물함을 대여 시도', async () => {
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
        // // 사물함의 상태가 SET_EXPIRE_FULL로 변경되는지 확인
        const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);
        expect(cabinetInfo.status).toBe(CabinetStatusType.SET_EXPIRE_FULL);
        // // lent 테이블에 대여 기록이 추가되는지 확인
        expect(await lentComponent.getLentCabinetId(user.user_id)).toBe(
          cabinetId,
        );
      });
    });

    describe('비정상적인 요청 - 권한이 없는 경우', () => {
      it('권한이 없는 유저의 대여 요청인 경우', async () => {
        // given
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = 'invalid_token';

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(401);
      });
    });

    describe('패널티 | 밴인 유저에 대한 테스트', () => {
      it('공유 사물함 패널티 기간중인 유저의 개인 사물함 대여 요청인 경우', async () => {
        // given
        // 대여 중인 사물함 x 이며, 현재 공유사물함 패널티 기간중인 유저
        const user: UserSessionDto = {
          user_id: 3,
          intra_id: 'penaltyuser1',
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

      it('공유 사물함 패널티 기간중인 유저의 공유 사물함 대여 요청인 경우', async () => {
        // given
        // 대여 중인 사물함 x 이며, 현재 공유사물함 패널티 기간중인 유저
        const user: UserSessionDto = {
          user_id: 3,
          intra_id: 'penaltyuser1',
        };
        // SHARE & AVAILABLE 사물함
        const cabinetId = 5;
        const token = jwtService.sign(user);
        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      it('밴이 된 유저의 대여 요청', async () => {
        // given
        // 대여 중인 사물함 x 이며, 밴 기간중인 유저
        const user: UserSessionDto = {
          user_id: 1,
          intra_id: 'banuser1',
        };
        // SHARE & AVAILABLE 사물함
        const cabinetId = 5;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });
    });

    describe('비정상적인 요청 - 이미 대여중인 사물함이 있는 경우', () => {
      it('PRIVATE & AVAILABLE 사물함을 대여 시도', async () => {
        // given
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 5,
          intra_id: 'lentuser1',
        };
        // PRIVATE & AVAILABLE 사물함
        const cabinetId = 1;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(400);
      });
    });

    describe('비정상적인 요청 - 이용 불가능한 사물함을 대여한 경우', () => {
      it('BANNED 사물함을 대여 시도', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // BANNED 사물함
        const cabinetId = 7;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      it('EXPIRED 사물함을 대여 시도', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // EXPIRED 사물함
        const cabinetId = 14;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      it('BROKEN 사물함을 대여 시도', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        // BROKEN 사물함
        const cabinetId = 6;
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .post(`/api/lent/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });

      describe('비정상적인 요청 - 잔여 자리가 없는 경우', () => {
        it('PRIVATE & SET_EXPIRE_FULL 사물함을 대여 시도', async () => {
          // given
          // 대여 중인 사물함 X 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 2,
            intra_id: 'banuser2',
          };
          // PRIVATE & SET_EXPIRE_FULL 사물함
          const cabinetId = 4;
          const token = jwtService.sign(user);

          // when
          const response = await request(app.getHttpServer())
            .post(`/api/lent/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(409);
        });

        it('SHARE & SET_EXPIRE_FULL 사물함을 대여 시도', async () => {
          // given
          // 대여 중인 사물함 X 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 2,
            intra_id: 'banuser2',
          };
          // SHARE & SET_EXPIRE_FULL 사물함
          const cabinetId = 8;
          const token = jwtService.sign(user);

          // when
          const response = await request(app.getHttpServer())
            .post(`/api/lent/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(409);
        });
      });

      describe('비정상적인 요청 - 동아리 사물함을 대여 시도한 경우', () => {
        it('CLUB & SET_EXPIRE_FULL 사물함을 대여 시도', async () => {
          // given
          // 대여 중인 사물함 X 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 2,
            intra_id: 'banuser2',
          };
          // CLUB & SET_EXPIRE_FULL 사물함
          const cabinetId = 12;
          const token = jwtService.sign(user);

          // when
          const response = await request(app.getHttpServer())
            .post(`/api/lent/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(409);
        });

        it('CLUB & AVAILABLE 사물함을 대여 시도', async () => {
          // given
          // 대여 중인 사물함 X 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 2,
            intra_id: 'banuser2',
          };
          // CLUB & AVAILABLE 사물함
          const cabinetId = 15;
          const token = jwtService.sign(user);

          // when
          const response = await request(app.getHttpServer())
            .post(`/api/lent/${cabinetId}`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(418);
        });
      });
    });
  });

  describe('/api/lent/update_cabinet_title (PATCH)', () => {
    describe('정상적인 요청 - 사물함 제목 업데이트에 성공합니다.', () => {
      it('자신이 대여한 사물함의 제목을 수정하는 경우', async () => {
        // given
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 5,
          intra_id: 'lentuser1',
        };
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .patch(`/api/lent/update_cabinet_title`)
          .send({
            cabinet_title: '여긴 내 사물함임',
          })
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(200);
      });
    });

    describe('비정상적인 요청 - 대여중인 사물함이 없는 경우', () => {
      it('대여중인 사물함이 없는 경우, 제목 업데이트에 실패합니다.', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .patch(`/api/lent/update_cabinet_title`)
          .send({
            cabinet_title: '여긴 내 사물함임',
          })
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });
    });
  });

  describe('/api/lent/update_cabinet_memo (PATCH)', () => {
    describe('정상적인 요청 - 사물함 메모 업데이트에 성공합니다.', () => {
      it('자신이 대여한 사물함의 메모를 수정하는 경우', async () => {
        // given
        // 대여 중인 사물함 O 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 5,
          intra_id: 'lentuser1',
        };
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .patch(`/api/lent/update_cabinet_memo`)
          .send({
            cabinet_memo: '비밀번호는 비밀입니다...',
          })
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(200);
      });
    });

    describe('비정상적인 요청 - 대여중인 사물함이 없는 경우', () => {
      it('대여중인 사물함이 없는 경우, 메모 업데이트에 실패합니다.', async () => {
        // given
        // 대여 중인 사물함 X 이며, ban 기록 없는 유저
        const user: UserSessionDto = {
          user_id: 2,
          intra_id: 'banuser2',
        };
        const token = jwtService.sign(user);

        // when
        const response = await request(app.getHttpServer())
          .patch(`/api/lent/update_cabinet_memo`)
          .send({
            cabinet_memo: '비밀번호는 비밀입니다...',
          })
          .set('Authorization', `Bearer ${token}`);

        // then
        expect(response.status).toBe(403);
      });
    });

    describe('/api/lent/return (DELETE)', () => {
      describe('정상적인 요청 - 사물함 반납에 성공합니다.', () => {
        it('PRIVATE & SET_EXPIRE_FULL 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 5,
            intra_id: 'lentuser1',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // // 사물함의 상태가 AVAILABLE로 변경되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
        });

        it('SHARE & SET_EXPIRE_FULL 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 13,
            intra_id: 'user5',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 SET_EXPIRE_AVAILABLE로 변경되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(
            CabinetStatusType.SET_EXPIRE_AVAILABLE,
          );
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
        });

        it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 2명) 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 11,
            intra_id: 'user3',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 SET_EXPIRE_AVAILABLE로 유지되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(
            CabinetStatusType.SET_EXPIRE_AVAILABLE,
          );
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
        });

        it('SHARE & SET_EXPIRE_AVAILABLE(대여 중인 사람이 1명) 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 17,
            intra_id: 'user9',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 AVAILABLE로 변경되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
        });

        it('SHARE & AVAILABLE 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 9,
            intra_id: 'user1',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 AVAILABLE로 유지되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
        });

        it('PRIVATE & EXPIRED 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 6,
            intra_id: 'lentuser2',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 AVAILABLE로 변경되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
          await banService.isBlocked(user.user_id, undefined);
        });

        it('SHARE & EXPIRED(대여 중인 사람이 1명) 반납 시도', async () => {
          // given
          // 대여 중인 사물함 O 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 16,
            intra_id: 'user8',
          };
          const token = jwtService.sign(user);

          const cabinetId = await lentComponent.getLentCabinetId(user.user_id);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(204);
          // 사물함의 상태가 AVAILABLE로 변경되는지 확인
          const cabinetInfo = await cabinetInfoService.getCabinetInfo(
            cabinetId,
          );
          expect(cabinetInfo.status).toBe(CabinetStatusType.AVAILABLE);
          // lent가 삭제되었는지 확인(해당 유저가 대여중인지 확인)
          expect(!(await lentComponent.getLentCabinetId(user.user_id))).toBe(
            true,
          );
          await banService.isBlocked(user.user_id, undefined);
        });
      });

      describe('비정상적인 요청 - 사물함을 빌리지 않은 경우', () => {
        it('사물함을 빌리지 않은 유저가 반납 시도', async () => {
          // given
          // 대여 중인 사물함 X 이며, ban 기록 없는 유저
          const user: UserSessionDto = {
            user_id: 2,
            intra_id: 'banuser2',
          };
          const token = jwtService.sign(user);

          // when
          const response = await request(app.getHttpServer())
            .delete(`/api/lent/return`)
            .set('Authorization', `Bearer ${token}`);

          // then
          expect(response.status).toBe(403);
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
