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
        expect(response.status).toBe(401); //401 Unauthorized
      });
    });

    describe('/api/cabinet_info/:location/:floor', () => {
      test('정상적인 요청', async () => {
        // given
        const cabiLocation = '새롬관';
        const cabiFloor = 2;
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabiLocation}/${cabiFloor}`)
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.section).toBeDefined();
        expect(response.body.cabinets).toBeDefined();
        expect(response.body.cabinets.cabinet_id).toBeDefined();
        expect(response.body.cabinets.cabinet_num).toBeDefined();
        expect(response.body.cabinets.is_lent).toBeDefined();
        expect(response.body.cabinets.lent_type).toBeDefined();
        expect(response.body.cabinets.max_user).toBeDefined();
        //NOTE: 선택적 프로퍼티는 어떻게 확인하는지 모르겠습니다.
      });

      test('비정상적인 요청 - 비정상적인 건물 파라미터 전달', async () => {
        // given
        const cabiLocation = '마루관';
        const cabiFloor = 2;
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabiLocation}/${cabiFloor}`)
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(400); // 400 Bad Request
      });

      test('비정상적인 요청 - 비정상적인 층 파라미터 전달', async () => {
        // given
        const cabiLocation = '새롬관';
        const cabiFloor = 10;
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabiLocation}/${cabiFloor}`)
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(400);
      });
    });

    describe('/api/cabinet_info/:cabinet_id', () => {
      test('정상적인 요청', async () => {
        // given
        const cabinetId = 1;
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabinetId}`)
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.cabinet_id).toBeDefined();
        expect(response.body.cabinet_num).toBeDefined();
        expect(response.body.is_lent).toBeDefined();
        expect(response.body.lent_type).toBeDefined();
        expect(response.body.max_user).toBeDefined();
        //NOTE: 선택적 프로퍼티는 어떻게 확인하는지 모르겠습니다.
      });

      test('정상적인 요청 - 본인의 cabinet_id를 요청한 경우', async () => {
        // given
        const cabinetId = 2; // TODO: 현재 사용 유저의 cabinet_id를 지정
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabinetId}`)
          .set('Cookie', userCookie);

        // then
        // TODO: api/my_lent_info로 리다이렉션
      });

      test('비정상적인 요청 - 비정상적인 cabinet_id 전달', async () => {
        // given
        const cabinetId = 9999999;
        const userCookie = cookie;

        // when
        const response = await request(app.getHttpServer())
          .get(`/api/cabinet_info/${cabinetId}`)
          .set('Cookie', userCookie);

        // then
        expect(response.status).toBe(400);
      });
    });
  });
});
