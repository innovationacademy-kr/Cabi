import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import TypeOrmConfigService from 'src/config/typeorm.config';
import { initTestDB, loadSQL } from '../utils';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { JwtService } from '@nestjs/jwt';
import { AdminUserDto } from 'src/admin/dto/admin.user.dto';
import { AdminAuthService } from 'src/admin/auth/auth.service';
import { AdminDevelopModule } from 'src/admin/develop/develop.module';

const testDBName = 'test_admin_develop';
const AUTHORIZATION = 'Authorization';
const BEARER = 'Bearer';

describe('Admin develop 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    await initTestDB(testDBName);
    initializeTransactionalContext();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AdminDevelopModule],
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

    jwtService = new JwtService({
      secret: process.env.JWT_SECRETKEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIREIN,
      },
    });
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = app.get(DataSource);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await loadSQL(queryRunner, 'test/test_db.sql');
    await queryRunner.release();
  });

  const baseUrl = '/api/admin/develop';

  describe(baseUrl, () => {
    const promoteUrl = '/promote';
    describe(`${promoteUrl} (GET)`, () => {
      it('정상적인 요청 302', async () => {
        const adminAuthService: AdminAuthService = app.get(AdminAuthService);
        //given
        const normalUser: AdminUserDto = {
          email: 'normal@example.com',
          role: 1,
        };
        const token = jwtService.sign(normalUser);

        const response = await request(app.getHttpServer())
          .get('/api/admin/develop/promote')
          .set(AUTHORIZATION, `${BEARER} ${token}`)
          .query({ email: normalUser.email });
        expect(response.status).toBe(302);
        expect(response.header['location']).toMatch(
          new RegExp('/api/admin/auth/login$'),
        );
        expect(await adminAuthService.getAdminUserRole(normalUser.email)).toBe(
          1,
        );
      });

      it('일반 유저 요청 302', async () => {
        const adminAuthService: AdminAuthService = app.get(AdminAuthService);
        const unauthUser: AdminUserDto = {
          email: 'unauth@example.com',
          role: 0,
        };
        const token = jwtService.sign(unauthUser);
        const response = await request(app.getHttpServer())
          .get(baseUrl + promoteUrl)
          .set(AUTHORIZATION, `${BEARER} ${token}`)
          .query({ email: unauthUser.email });
        expect(response.status).toBe(302);
        expect(response.header['location']).toMatch(
          new RegExp('/api/admin/auth/login$'),
        );
        expect(await adminAuthService.getAdminUserRole(unauthUser.email)).toBe(
          1,
        );
      });

      it('없는 유저 요청 302', async () => {
        const adminAuthService: AdminAuthService = app.get(AdminAuthService);
        const notExistedUser: AdminUserDto = {
          email: 'empty@example.com',
          role: 0,
        };
        const token = jwtService.sign(notExistedUser);
        expect(
          await adminAuthService.checkUserExists(notExistedUser.email),
        ).toBe(false);
        const response = await request(app.getHttpServer())
          .get(baseUrl + promoteUrl)
          .set(AUTHORIZATION, `${BEARER} ${token}`)
          .query({ email: notExistedUser.email });
        expect(response.status).toBe(302);
      });

      it('최고관리자 요청 302', async () => {
        const superUser: AdminUserDto = {
          email: 'super@example.com',
          role: 2,
        };
        const token = jwtService.sign(superUser);
        const response = await request(app.getHttpServer())
          .get(baseUrl + promoteUrl)
          .set(AUTHORIZATION, `${BEARER} ${token}`)
          .query({ email: superUser.email });
        expect(response.status).toBe(302);
      });

      it('비어있는 쿼리스트링 302', async () => {
        const empty: AdminUserDto = {
          email: 'empty@example.com',
          role: 0,
        };
        const token = jwtService.sign(empty);
        const response = await request(app.getHttpServer())
          .get(baseUrl + promoteUrl)
          .set(AUTHORIZATION, `${BEARER} ${token}`);
        expect(response.status).toBe(302);
      });

      it('로그인 정보가 없을 때 302', async () => {
        const response = await request(app.getHttpServer())
          .get(baseUrl + promoteUrl)
          .query({ email: 'normal@example.com' });
        expect(response.status).toBe(302);
      });
    });
    afterAll(async () => {
      app.close();
    });
  });
});
