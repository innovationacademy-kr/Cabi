import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Cabinet E2E Test', () => {
  let app: INestApplication;
  let cookie: string[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    const response = await request(app.getHttpServer()).get('/auth/login');
    cookie = response.headers('set-cookie');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('cabinet에 관련 된 api test', () => {
    describe('/api/cabinet_info', () => {
      test('정상적인 요청', async () => {
        // given
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get('/api/cabinet_info')
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.location).toBeDefined();
        expect(response.body.floors).toBeDefined();
      //expect(response.body).toContain('');
      //expect(response.body.floors).toContain('');
      // NOTE: 배열인지 확인하는 matcher는 찾지 못해서 주석처리 합니다. 
      });

      test('비정상적인 요청 - 잘못된 세션', async () => {
        //given
        const userCookie = 'string';

        //when
        const response = await request(app.getHttpServer())
          .get('/api/cabinet_info')
          .set('Cookie', userCookie);

        //then
        expect(response.status).toBe(401);
      });
    });
  });

});
