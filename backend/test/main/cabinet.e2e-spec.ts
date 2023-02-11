import { HttpStatus, INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import TypeOrmConfigService from "src/config/typeorm.config";
import { initTestDB, loadSQL } from "../utils";
import * as request from 'supertest';
import { DataSource } from "typeorm";
import { initializeTransactionalContext } from "typeorm-transactional";
import { UserSessionDto } from "src/dto/user.session.dto";
import { SpaceDataResponseDto } from "src/dto/response/space.data.response.dto";
import { SpaceDataDto } from "src/dto/space.data.dto";

describe('Main Cabinet 모듈 테스트 (e2e)', () => {
	let app: INestApplication;
	let jwtService: JwtService;
	let token: string;
	let route: string;

	beforeAll(async () =>{
		await initTestDB('test_main_cabinet');
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
					database: 'test_main_cabinet',
					entities: ['src/**/*.entity.ts'],
					synchronize: true,
					dropSchema: true,
				};
			})
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

		 // given : 일반 유저의 토큰
		 const user: UserSessionDto = {
			user_id: 6,
			intra_id: 'lentuser2',
		  };
		token = jwtService.sign(user);
		route = '/api/cabinet_info';
	});

	it('DB 연동 확인', () => {
		expect(app).toBeDefined();
	});

	beforeEach(async () => {
		const dataSource = app.get(DataSource);
		const queryRunner = dataSource.createQueryRunner();
		await queryRunner.connect();
		await loadSQL(queryRunner, 'test/test_db.sql');
		await queryRunner.release();
	});

	describe('GET : /api/cabinet_info/', () => {
		describe('정상적인 요청 - 현재 서비스하는 건물의 층별 정보를 가져옵니다.', () => {
			it('건물 / 층 정보를 조회합니다.', async () => {
				// given : None

				// when : 조회 요청
				const response  = await request(app.getHttpServer())
				.get(`${route}`)
				.set('Authorization', `Bearer ${token}`);

				const response2  = await request(app.getHttpServer())
				.get(`${route}/hello`)
				.set('Authorization', `Bearer ${token}`);

				
				// then : 200 - OK
				expect(response.status).toBe(HttpStatus.OK);
				expect(response.body).toHaveProperty('space_data');
				const expectBody = {
					space_data: [{
						location: '새롬관',
						floors: [2, 4, 5],
					}],
				}
				expect(response.body).toStrictEqual(expectBody);
			});
		});
	});

	describe('GET : /api/cabinet_info/:location/:floor', () => {
		describe('정상적인 요청 - 해당 층에 존재하는 섹션과 사물함의 정보를 가져옵니다.', () => {
			it('존재하는 층의 정보를 조회합니다.', async () => {
				// given : 건물(encoded), 층
				const location = encodeURIComponent('새롬관');
				const floor = 2;

				// when : 조회 요청
				const response = await request(app.getHttpServer())
				.get(`${route}/${location}/${floor}`)
				.set('Authorization', `Bearer ${token}`);

				// then : 200 - OK
				expect(response.status).toBe(HttpStatus.OK);
			});
		});
	});

	describe('GET : /api/cabinet_info/:cabinet_id', () => {
		describe('정상적인 요청 - cabinetId로 해당 사물함의 정보를 조회합니다.', () => {
			it ('있는 사물함의 정보를 조회합니다.', async () => {
				// given : cabinetId
				const cabinetId = 1;
				
				// when : 조회 요청
				const response = await request(app.getHttpServer())
				.get(`${route}/${cabinetId}`)
				.set('Authorization', `Bearer ${token}`);

				// then : 200 - OK
				expect(response.status).toBe(HttpStatus.OK);
			});
		});
	});

	afterAll(async () => {
		app.close();
	  });
})