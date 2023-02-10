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

describe.skip('Admin Cabinet 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

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

    // given : 권한 있는 관리자의 토큰
    const adminUser: AdminUserDto = {
      email: 'test@gmail.com',
      role: AdminUserRole.ADMIN,
    };
    token = jwtService.sign(adminUser);
  });

  it('DB 연동 테스트', () => {
    expect(app).toBeDefined();
  });

  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });

  describe('api/admin/catbinet/:cabinetId', () => {
    describe('정상적인 요청 - 캐비닛 정보 조회에 성공합니다.', () => {
      describe('PRIVATE, SHARE, CLUB 사물함의 정보를 각각 조회합니다.', () => {
        it('PRIVATE 사물함의 정보를 조회합니다', async () => {
          //given : 개인 사물함의 cabinetId
          const cabinetIdPrivate = 1;

          //when : 조회 시도
          const responsePrivate = await request(app.getHttpServer())
            .get(`api/admin/cabinet/${cabinetIdPrivate}`)
            .set('Authorization', `Bearer ${token}`);

          //then : 요청 응답 성공
          expect(responsePrivate.status).toBe(HttpStatus.OK);
          console.log(
            `******************${responsePrivate.body}***************`,
          );
        });

        it('SHARE 사물함의 정보를 조회합니다', async () => {
          //given : 공유 사물함의 cabinetId
          const cabinetIdShare = 8;

          //when : 조회 시도
          const responseShare = await request(app.getHttpServer())
            .get(`api/admin/cabinet/${cabinetIdShare}`)
            .set('Authorization', `Bearer ${token}`);

          //then : 요청 응답 성공
          expect(responseShare.status).toBe(HttpStatus.OK);
        });

        it('CLUB 사물함의 정보를 조회합니다', async () => {
          //given : 동아리 사물함의 cabinetId
          const cabinetIdClub = 12;

          //when : 조회 시도
          const responseClub = await request(app.getHttpServer())
            .get(`api/admin/cabinet/${cabinetIdClub}`)
            .set('Authorization', `Bearer ${token}`);

          //then : 요청 응답 성공
          expect(responseClub.status).toBe(HttpStatus.OK);
        });
      });
    });

    describe('비정상적인 요청 - 캐비닛 정보 조회에 실패합니다.', () => {
      it('없는 사물함의 정보를 조회합니다.', async () => {
        //given : 없는 사물함의 cabinetId
        const cabinetIdNoneExist = 3306;

        //when
        const responseNoneExist = await request(app.getHttpServer())
          .get(`api/admin/cabinet/${cabinetIdNoneExist}`)
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(responseNoneExist.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  afterAll(async () => {
    app.close();
  });
});
