import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import AdminUserRole from 'src/admin/enums/admin.user.role.enum';
import { AppModule } from 'src/app.module';
import TypeOrmConfigService from 'src/config/typeorm.config';
import { initTestDB, loadSQL } from '../utils';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import * as request from 'supertest';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import { CabinetFloorDto } from 'src/admin/dto/cabinet.floor.dto';

describe('Admin Cabinet 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let mainCabinetInfoService: CabinetInfoService;
  let token: string;
  let route: string;

  beforeAll(async () => {
    await initTestDB('test_admin_cabinet');
    initializeTransactionalContext();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideFilter(TypeOrmConfigService)
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
              database: 'test_admin_cabinet',
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
    mainCabinetInfoService = app.get(CabinetInfoService);

    // given : 권한 있는 관리자의 토큰
    const adminUser: AdminUserDto = {
      email: 'normal@example.com',
      role: AdminUserRole.ADMIN,
    };
    token = jwtService.sign(adminUser);
    route = '/api/admin/cabinet';
  });

  it('DB 연동 && 토큰 발급 확인', () => {
    expect(app).toBeDefined();
    expect(token).toBeDefined();
  });

  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });

  describe('GET: api/admin/catbinet/:cabinetId', () => {
    describe('정상적인 요청 - 캐비닛 정보 조회에 성공합니다.', () => {
      it('있는 사물함의 정보를 조회합니다', async () => {
        //given : cabinetId
        const cabinetId = 1;

        //when : 조회 시도
        const response = await request(app.getHttpServer())
          .get(`${route}/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200 - OK
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toHaveProperty('location', '새롬관');
        expect(response.body).toHaveProperty('floor', 2);
      });
    });

    describe('비정상적인 요청 - 캐비닛 정보 조회에 실패합니다.', () => {
      it('없는 사물함의 정보를 조회합니다.', async () => {
        //given : 없는 사물함의 cabinetId
        const cabinetId = 8080;

        //when : 조회 시도
        const response = await request(app.getHttpServer())
          .get(`${route}/${cabinetId}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 400 - Bad Request
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PATCH : api/admin/catbinet/status/:cabinetId/:status', () => {
    describe('정상적인 요청 - 사물함의 상태를 변경합니다.', () => {
      it('AVAILABLE 사물함의 상태를 BANNED로 변경합니다.', async () => {
        //given : AVAILABLE cabinetId
        const cabinetId = 1;
        const statusToChange = CabinetStatusType.BANNED;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/status/${cabinetId}/${statusToChange}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200 - OK
        expect(response.status).toBe(HttpStatus.OK);
        expect(
          (await mainCabinetInfoService.getCabinetInfo(cabinetId)).status,
        ).toBe(statusToChange);
      });

      it('BANNED 사물함의 상태를 AVAILABLE로 변경합니다.', async () => {
        //given : SHARE - BANNED cabinetId
        const cabinetId = 7;
        const statusToChange = CabinetStatusType.AVAILABLE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/status/${cabinetId}/${statusToChange}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200 - OK
        expect(response.status).toBe(HttpStatus.OK);
        expect(
          (await mainCabinetInfoService.getCabinetInfo(cabinetId)).status,
        ).toBe(statusToChange);
      });
    });

    describe('비정상적인 요청 - 없는 사물함의 상태를 변경합니다.', () => {
      it('없는 사물함의 상태를 AVAILABLE로 변경합니다.', async () => {
        //given : cabinetId
        const cabinetId = 8080;
        const statusToChange = CabinetStatusType.AVAILABLE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/status/${cabinetId}/${statusToChange}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200 - OK -> 400 Bad Request로 변경 필요 예상
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PATCH : api/admin/cabinet/lentType/:cabinetId/:lentType', () => {
    describe('정상적인 요청 - 사물함의 대여 타입을 변경합니다.', () => {
      it('개인 사물함을 공유사물함으로 변경합니다.', async () => {
        //given : cabinetId
        const cabinetId = 1;
        const lentType = LentType.SHARE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/lentType/${cabinetId}/${lentType}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        expect(
          (await mainCabinetInfoService.getCabinetInfo(cabinetId)).lent_type,
        ).toBe(lentType);
      });

      it('공유 사물함을 개인 사물함으로 변경합니다.', async () => {
        //given : cabinetId
        const cabinetId = 7;
        const lentType = LentType.PRIVATE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/lentType/${cabinetId}/${lentType}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        expect(
          (await mainCabinetInfoService.getCabinetInfo(cabinetId)).lent_type,
        ).toBe(lentType);
      });
    });

    describe('비정상적인 요청 - 없는 사물함의 대여 타입을 변경합니다.', () => {
      it('없는 사물함의 대여 타입을 변경합니다.', async () => {
        //given : cabinetId
        const cabinetId = 8080;
        const lentType = LentType.SHARE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/lentType/${cabinetId}/${lentType}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 400 - Bad Request
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PATCH : api/admin/cabinet/statusNote/:cabinetId', () => {
    describe('정상적인 요청 - 사물함의 고장 사유를 변경합니다.', () => {
      it('사물함의 고장 사유를 변경합니다.', async () => {
        //given : cabinetId, statusNote
        const cabinetId = 6;
        const statusNote = 'Got broken by ccabi!';

        //when : 변경 시도
        const body = {
          status_note: statusNote,
        };

        const response = await request(app.getHttpServer())
          .patch(`${route}/statusNote/${cabinetId}`)
          .send(body)
          .set('Authorization', `Bearer ${token}`);

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        // expect(await mainCabinetInfoService.getCabinetInfo(cabinetId)['statusNote'])
        // .toBe(statusNote); <- admin의 cabinetDto에만 존재하고, 기존에 가져오는 api의 반환값에서 statusNote가 존재하지 않아서 테스트 불가능.
      });
    });

    describe('비정상적인 요청 - 없는 사물함의 고장 사유를 변경합니다.', () => {
      it('없는 사물함의 고장 사유를 변경합니다.', async () => {
        //given : cabinetId, statusNote
        const cabinetId = 8080;
        const statusNote = 'Got broken by ccabi!';

        //when : 변경 시도
        const body = {
          status_note: statusNote,
        };

        const response = await request(app.getHttpServer())
          .patch(`${route}/statusNote/${cabinetId}`)
          .send(body)
          .set('Authorization', `Bearer ${token}`);

        //then : 400 - Bad Request
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PATCH : api/admin/catbinet/bundle/status/:status', () => {
    describe('정상적인 요청 - 배열에 담긴 cabinetId에 해당하는 사물함의 상태를 변경합니다.', () => {
      it('BROKEN, BANNED, EXPIRED인 사물함들을 AVAILABLE으로 변경합니다.', async () => {
        //given : BROKEN - 2, BANNED - 3, EXPIRED - 13
        const cabinetIdArray = [2, 3, 13];
        const statusToChange = CabinetStatusType.AVAILABLE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/bundle/status/${statusToChange}`)
          .send(cabinetIdArray)
          .set('Authorization', `Bearer ${token}`);

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        cabinetIdArray.forEach(async (cabinetId) => {
          expect(
            (await mainCabinetInfoService.getCabinetInfo(cabinetId)).status,
          ).toBe(statusToChange);
        });
      });
    });

    describe('비정상적인 요청 - 없는 cabinetId가 포함된 배열의 상태를 변경합니다.', () => {
      it('BROKEN, 없는 사물함, EXPIRED인 cabinetId를 AVAILABLE으로 변경합니다.', async () => {
        //given : BROKEN - 2, noneExist - 8080, EXPIRED - 13
        const cabinetIdArray = [2, 8080, 13];
        const status = CabinetStatusType.AVAILABLE;

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/bundle/status/${status}`)
          .send(cabinetIdArray)
          .set('Authorization', `Bearer ${token}`);

        //then : 400 - Bad Request
        expect(response.status).toBe(HttpStatus.OK);
        expect((await mainCabinetInfoService.getCabinetInfo(2)).status)
          // 중간에 잘못된 사물함의 cabinetId가 들어가도, 나머지 사물함들의 상태는 변경 됨.
          .toBe(CabinetStatusType.AVAILABLE);
        expect((await mainCabinetInfoService.getCabinetInfo(13)).status).toBe(
          CabinetStatusType.AVAILABLE,
        );
      });
    });
  });

  describe('PATCH : api/admin/catbinet/:cabinetId/:title', () => {
    describe('정상적인 요청 - 사물함의 title을 변경합니다.', () => {
      it('title이 CABI인 사물함을 HELLO_CCABI로 변경합니다.', async () => {
        //given : cabinetId, title
        const cabinetId = 12;
        const titleToChange = 'HELLO_CABI';

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .patch(`${route}/${cabinetId}/${titleToChange}`)
          .set('Authorization', `Bearer ${token}`);

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        expect(
          (await mainCabinetInfoService.getCabinetInfo(cabinetId))
            .cabinet_title,
        ).toBe(titleToChange);
      });
    });
  });

  describe('GET : api/admin/catbinet/count/floor', () => {
    describe('정상적인 요청 - 전 층의 사물함 정보를 가져옵니다.', () => {
      it('2층, 4층, 5층에 있는 15개의 사물함 정보 배열을 가져옵니다.', async () => {
        //given : None

        //when : 변경 시도
        const response = await request(app.getHttpServer())
          .get(`${route}/count/floor`)
          .set('Authorization', `Bearer ${token}`);
        const allFloorInfo: CabinetFloorDto[] = response.body;

        //then : 200
        expect(response.status).toBe(HttpStatus.OK);
        expect(Array.isArray(allFloorInfo)).toBe(true);
        allFloorInfo.forEach(async (cabinetFloorInfo) => {
          const keys = Object.keys(cabinetFloorInfo);
          keys.forEach(async (key) => {
            expect(key).toBeDefined();
          });
        });
      });
    });
  });
  afterAll(async () => {
    app.close();
  });
});
