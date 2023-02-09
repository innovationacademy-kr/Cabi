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
import { UserInfoPagenationDto } from 'src/admin/dto/user.info.pagenation.dto';
import { UserCabinetInfoPagenationDto } from 'src/admin/dto/user.cabinet.info.pagenation.dto';
import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { UserCabinetInfoDto } from 'src/admin/dto/user.cabinet.info.dto';

/* eslint-disable */
const timekeeper = require('timekeeper');

/**
 * 실제 테스트에 사용할 DB 이름을 적습니다.
 * 테스트 파일들이 각각 병렬적으로 실행되므로, DB 이름을 다르게 설정해야 합니다.
 */
const testDBName = 'test_admin_search';

describe('Admin Search 모듈 테스트 (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token;
  let adminUser: AdminUserDto;

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
              timezone: 'Asia/Seoul'
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

    //admin user
    adminUser = {
      email: 'normal@example.com',
      role: 1,
    };

    //admin token
    token = jwtService.sign(adminUser);

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

  describe('/intraId/:intraId (GET)', () => {
    describe('정상적인 요청', () => {
      test('특정 문자열이 포함된 유저 리스트 반환', async () => {
        //given
        const IntraId = 'lent';
        const page = 0;
        const length = 10;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result: UserInfoPagenationDto = {
          result : [{user_id : 5, intra_id : "lentuser1"}, {user_id : 6, intra_id : "lentuser2"}],
          total_length : 2,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('특정 문자열이 포함된 유저 리스트 중 2번째 페이지 반환', async () => {
        //given
        const IntraId = 's';
        const page = 2;
        const length = 3;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result: UserInfoPagenationDto = {
          "result": [
            {
              "user_id": 7,
              "intra_id": "koreauser"
            },
            {
              "user_id": 8,
              "intra_id": "foreignuser"
            },
            {
              "user_id": 9,
              "intra_id": "user1"
            }
          ],
          "total_length": 17
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('db에 존재하지 않는 데이터 요청', async () => {
        //given
        const IntraId = 'eunbikim';
        const page = 0;
        const length = 10;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result: UserInfoPagenationDto = {
          result : [],
          total_length : 0,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('데이터가 존재하지 않는 페이지 요청', async () => {
        //given
        const IntraId = 'lent';
        const page = 2;
        const length = 10;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result: UserInfoPagenationDto = {
          result : [],
          total_length : 2,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
    });
    
    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const intraId = 'lent';
        const page = 0;
        const length = 10;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      test('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const intraId = "user1";
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const intraId = "user1";
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/intraId/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })

  describe('/:intraId (GET)', () => {
    describe('정상적인 요청', () => {
      test('IntraId에 특정 문자열을 포함하는 유저들의 리스트를 반환', async () => {
        //given
        const IntraId = 'user';
        const page = 2;
        const length = 4;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result: [
            {
              "user_id" : 11,
              "intra_id": "user3",
              "cabinetInfo": {
                "cabinet_id": 11,
                "cabinet_num": 11,
                "lent_type": LentType.SHARE,
                "cabinet_title": null,
                "max_user": 3,
                "status": CabinetStatusType.SET_EXPIRE_AVAILABLE,
                "section": "Cluster 5 - OA",
                "location": "새롬관",
                "floor": 5,
                "status_note": null
              }
            },
            {
              "user_id": 12,
              "intra_id": "user4",
              "cabinetInfo": {
                "cabinet_id": 11,
                "cabinet_num": 11,
                "lent_type": LentType.SHARE,
                "cabinet_title": null,
                "max_user": 3,
                "status": CabinetStatusType.SET_EXPIRE_AVAILABLE,
                "section": "Cluster 5 - OA",
                "location": "새롬관",
                "floor": 5,
                "status_note": null
              }
            },
            {
              "user_id": 6,
              "intra_id": "lentuser2",
              "cabinetInfo": {
                "cabinet_id": 13,
                "cabinet_num": 13,
                "lent_type": LentType.PRIVATE,
                "cabinet_title": null,
                "max_user": 1,
                "status": CabinetStatusType.EXPIRED,
                "section": "End of Cluster 5",
                "location": "새롬관",
                "floor": 5,
                "status_note": null
              }
            },
            {
              "user_id": 1,
              "intra_id": "banuser1",
              "cabinetInfo": null,
            }
          ],
          "total_length": 17,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('db에 존재하지 않는 데이터 요청', async () => {
        //given
        const IntraId = 'eunbikim';
        const page = 0;
        const length = 10;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result: [],
          total_length: 0,
        };

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('데이터가 존재하지 않는 페이지 요청', async () => {
        //given
        const IntraId = 'lent';
        const page = 2;
        const length = 10;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${IntraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result: UserInfoPagenationDto = {
          result : [],
          total_length : 2,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
    })

    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const intraId = 'lent';
        const page = 0;
        const length = 10;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      test('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const intraId = "user1";
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const intraId = "user1";
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/${intraId}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })

  describe('/cabinet/lentType/:lentType (GET)', () => {
	  describe('정상적인 요청 - 특정 lentType의 사물함 리스트 요청', () => {
		  test('PRIVATE 사물함 검색', async () => {
        //given
        const lentType = LentType.PRIVATE;
        const page = 0;
        const length = 3;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result : [
            {
              cabinet_id : 1,
              cabinet_num : 1,
              lent_type : LentType.PRIVATE,
              cabinet_title : null,
              max_user : 1,
              status : CabinetStatusType.AVAILABLE,
              location : "새롬관",
              floor : 2,
              section : "Oasis",
              lent_info : [],
            },
            {
              cabinet_id : 2,
              cabinet_num : 2,
              lent_type : LentType.PRIVATE,
              cabinet_title : null,
              max_user : 1,
              status : CabinetStatusType.BROKEN,
              location : "새롬관",
              floor : 2,
              section : "End of Cluster 2",
              lent_info : [],
            },
            {
              cabinet_id : 3,
              cabinet_num : 3,
              lent_type : LentType.PRIVATE,
              cabinet_title : null,
              max_user : 1,
              status : CabinetStatusType.BANNED,
              location : "새롬관",
              floor : 4,
              section : "Oasis",
              lent_info : [],
            },
          ],
          total_length : 5,
        }

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('SHARE 사물함 검색', async () => {
        //given
        const lentType = LentType.SHARE;
        const page = 1;
        const length = 3;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result : [
            {
              cabinet_id : 8,
              cabinet_num : 8,
              lent_type : LentType.SHARE,
              cabinet_title : null,
              max_user : 3,
              status : CabinetStatusType.SET_EXPIRE_FULL,
              location : "새롬관",
              floor : 4,
              section : "End of Cluster 3",
              lent_info : [{
                user_id : 13,
                intra_id : "user5",
                lent_id : 7,
                lent_time : "2022-12-15T08:59:59.000Z",
                expire_time : "2023-01-25T23:59:59.000Z",
              },
              {
                user_id : 14,
                intra_id : "user6",
                lent_id : 8,
                lent_time : "2022-12-15T12:59:59.000Z",
                expire_time : "2023-01-25T23:59:59.000Z",
              },
              {
                user_id : 15,
                intra_id : "user7",
                lent_id : 9,
                lent_time : "2022-12-15T04:59:59.000Z",
                expire_time : "2023-01-25T23:59:59.000Z",
              },],
            },
            {
              cabinet_id : 9,
              cabinet_num : 9,
              lent_type : LentType.SHARE,
              cabinet_title : null,
              max_user : 3,
              status : CabinetStatusType.SET_EXPIRE_AVAILABLE,
              location : "새롬관",
              floor : 5,
              section : "Oasis",
              lent_info : [{
                user_id : 17,
                intra_id : "user9",
                lent_id : 11,
                lent_time : "2023-01-03T23:47:59.000Z",
                expire_time : "2023-02-13T23:59:59.000Z",
              },],
            },
            {
              cabinet_id : 10,
              cabinet_num : 10,
              lent_type : LentType.SHARE,
              cabinet_title : null,
              max_user : 3,
              status : CabinetStatusType.AVAILABLE,
              location : "새롬관",
              floor : 2,
              section : "Cluster 1 - OA",
              lent_info : [{
                user_id : 9,
                intra_id : "user1",
                lent_id : 3,
                lent_time : "2023-01-03T22:59:05.000Z",
                expire_time : null,
              },
              {
                user_id : 10,
                intra_id : "user2",
                lent_id : 4,
                lent_time : "2023-01-03T21:59:59.000Z",
                expire_time : null,
              },],
            },
          ],
          total_length : 8,
        }

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('CLUB 사물함 검색', async () => {
        //given
        const lentType = LentType.CLUB;
        const page = 0;
        const length = 3;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result : [
            {
              cabinet_id : 12,
              cabinet_num : 12,
              lent_type : LentType.CLUB,
              cabinet_title : "CABI",
              max_user : 3,
              status : CabinetStatusType.SET_EXPIRE_FULL,
              location : "새롬관",
              floor : 2,
              section : "Cluster 1 - OA",
              lent_info : [],
            },
            {
              cabinet_id : 15,
              cabinet_num : 15,
              lent_type : LentType.CLUB,
              cabinet_title : null,
              max_user : 3,
              status : CabinetStatusType.AVAILABLE,
              location : "새롬관",
              floor : 2,
              section : "Cluster 1 - OA",
              lent_info : [],
            },
          ],
          total_length : 2,
        }

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
	  })

    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const lentType = LentType.PRIVATE;
        const page = 0;
        const length = 3;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      test('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const lentType = LentType.PRIVATE;
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const lentType = LentType.PRIVATE;
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      test('비정상적인 LentType이 들어온 경우', async () => {
        //given
        const lentType = "CABI";
        const page = 0
        const length = 2;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/lentType/${lentType}`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })

  describe('/cabinet/visibleNum/:visibleNum (Get)', () => {
    describe('정상적인 요청', () => {
      test('해당 사물함 번호를 가진 사물함 리스트 반환', async () => {
        //given
        const visibleNum = 1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/visibleNum/${visibleNum}`)
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result : [{
            cabinet_id : 1,
            cabinet_num : 1,
            lent_type : LentType.PRIVATE,
            cabinet_title : null,
            max_user : 1,
            status : CabinetStatusType.AVAILABLE,
            location : "새롬관",
            floor : 2,
            section : "Oasis",
            lent_info : [],
          },],
          total_length : 1,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });

      test('db에 존재하지 않은 사물함 번호', async () => {
        //given
        const visibleNum = 9999;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/visibleNum/${visibleNum}`)
          .set('Authorization', `Bearer ${token}`);

        const result = {
          result : [],
          total_length : 0,
        }
        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
    })

    describe('비정상적인 요청', () => {
      test('visibleNum이 숫자가 아닌 경우', async () => {
        //given
        const visibleNum = "cabi";
  
        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/visibleNum/${visibleNum}`)
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const emptyToken = "";
        const visibleNum = 1;
  
        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/visibleNum/${visibleNum}`)
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });
    })
  })

  describe('/cabinet/banned (GET)', () => {
    describe('정상적인 요청', () => {
      test('정지당한 사물함 리스트를 반환', async () => {
        //given
        const page = 0;
        const length = 5;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);
        
        const result = {
          result : [{
            cabinet_id : 3,
            cabinet_num : 3,
            lent_type : LentType.PRIVATE,
            cabinet_title : null,
            max_user : 1,
            status : CabinetStatusType.BANNED,
            location : "새롬관",
            floor : 4,
            section : "Oasis",
            lent_info : [],},
            {
              cabinet_id : 7,
              cabinet_num : 7,
              lent_type : LentType.SHARE,
              cabinet_title : null,
              max_user : 3,
              status : CabinetStatusType.BANNED,
              location : "새롬관",
              floor : 4,
              section : "Cluster 3 - OA",
              lent_info : [],
            },],
          total_length : 2,
        };

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
    })

    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const page = 0;
        const length = 3;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      test('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })

  describe('/cabinet/broken (GET)', () => {
    describe('정상적인 요청', () => {
      test('고장난 사물함 리스트를 반환', async () => {
        //given
        const page = 0;
        const length = 5;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/broken`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);
        
        const result = {
          result : [{
            cabinet_id : 2,
            cabinet_num : 2,
            lent_type : LentType.PRIVATE,
            note : null,
            max_user : 1,
            section : "End of Cluster 2",
            },
            {
              cabinet_id : 6,
              cabinet_num : 6,
              lent_type : LentType.SHARE,
              note : null,
              max_user : 3,
              section : "End of Cluster 1",
            },],
          total_length : 2,
        };

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
      });
    })

    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const page = 0;
        const length = 3;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/broken`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      test('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/broken`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/cabinet/broken`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })


  describe('/user/banned (GET)', () => {
    describe('정상적인 요청', () => {
      test('정지당한 유저 리스트를 반환', async () => {
        timekeeper.freeze(new Date('2023-01-15T09:00:00Z'));
        //given
        const page = 0;
        const length = 5;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/user/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);
        
        const result = {
          result : [{
              user_id : 1,
              intra_id : "banuser1",
              banned_date: "2023-01-14T17:32:13.000Z",
              unbanned_date: "2023-01-15T17:32:13.000Z",
            },
            {
              user_id : 3,
              intra_id : "penaltyuser1",
              banned_date: "2023-01-14T17:32:45.000Z",
              unbanned_date: "2023-01-17T17:32:45.000Z",
            },],
          total_length : 2,
        };

        //then
        expect(response.body).toStrictEqual(result);
        expect(response.status).toBe(200);
        timekeeper.reset();
      });
    })

    describe('비정상적인 요청', () => {
      test('jwt token 존재하지 않는 경우', async () => {
        //given
        const page = 0;
        const length = 3;
        const emptyToken = "";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/user/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${emptyToken}`);

        //then
        expect(response.status).toBe(401);
      });

      //TODO: 해당 메소드에 validation pipe가 빠져있습니다.
      test.skip('비정상적인 query - 문자가 들어 온 경우', async () => {
        //given
        const page = "a"
        const length = "a";

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/user/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });

      //TODO: 현재 이 경우에 대한 처리가 되어 있지 않습니다. 400 bad request를 반환해야합니다.
      test.skip('비정상적인 query - 길이가 음수인 경우', async () => {
        //given
        const page = 0
        const length = -1;

        //when
        const response = await request(app.getHttpServer())
          .get(`/api/admin/search/user/banned`)
          .query({page, length})
          .set('Authorization', `Bearer ${token}`);

        //then
        expect(response.status).toBe(400);
      });
    })
  })

  afterAll(async () => {
    await app.close();
  });
});
