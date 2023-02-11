import { HttpStatus, INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AdminUserDto } from "src/admin/dto/admin.user.dto";
import AdminUserRole from "src/admin/enums/admin.user.role.enum";
import { AppModule } from "src/app.module";
import TypeOrmConfigService from "src/config/typeorm.config";
import { initTestDB, loadSQL } from "../utils";
import { DataSource } from "typeorm";
import { initializeTransactionalContext } from "typeorm-transactional";
import * as request from 'supertest';
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import LentType from "src/enums/lent.type.enum";

describe('Admin Cabinet 모듈 테스트 (e2e)', () => {
	let app: INestApplication;
	let jwtService: JwtService;
	let token: string;

	beforeAll(async () =>{
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

		// given : 권한 있는 관리자의 토큰
		const adminUser: AdminUserDto = {
			email: 'normal@example.com',
			role: AdminUserRole.ADMIN,
		}
		token = jwtService.sign(adminUser);
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
			it('PRIVATE 사물함의 정보를 조회합니다', async () => {
				//given : 개인 사물함의 cabinetId
				const cabinetIdPrivate = 1;

				//when : 조회 시도
				const responsePrivate = await request(app.getHttpServer())
				.get(`/api/admin/cabinet/${cabinetIdPrivate}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(responsePrivate.status).toBe(HttpStatus.OK);
			});
		});

		describe('비정상적인 요청 - 캐비닛 정보 조회에 실패합니다.', () => {
			it('없는 사물함의 정보를 조회합니다.', async () => {
				//given : 없는 사물함의 cabinetId
				const cabinetIdNoneExist = 3306;

				//when : 조회 시도
				const responseNoneExist = await request(app.getHttpServer())
				.get(`/api/admin/cabinet/${cabinetIdNoneExist}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 400
				expect(responseNoneExist.status).toBe(HttpStatus.BAD_REQUEST);
			})
		});
	});

	describe('PATCH : api/admin/catbinet/status/:cabinetId/:status', () => {
		describe('정상적인 요청 - 사물함의 상태를 변경합니다.', () => {
			it('사물함의 AVAILABLE 상태를 BANNED로 변경합니다.', async () => {
				//given : AVAILABLE cabinetId
				const cabinetIdAvailable = 1;
				const statusToChange = CabinetStatusType.BANNED;

				//when : 변경 시도
				const responseAvailable = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/status/${cabinetIdAvailable}/${statusToChange}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(responseAvailable.status).toBe(HttpStatus.OK);
			});

			it('BANNED 사물함의 상태를 AVAILABLE로 변경합니다.', async () => {
				//given : SHARE - BANNED cabinetId
				const cabinetIdBanned = 7;
				const statusToChange = CabinetStatusType.AVAILABLE;

				//when : 변경 시도
				const responseBanned = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/status/${cabinetIdBanned}/${statusToChange}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(responseBanned.status).toBe(HttpStatus.OK);
				//잘 바뀌었는지 확인한다.
			});
		});
	});

	describe('PATCH : api/admin/cabinet/lentType/:cabinetId/:lentType', () => {
		describe('정상적인 요청 - 사물함의 대여 타입을 변경합니다.', () => {
			it('개인 사물함을 공유사물함으로 변경합니다.', async () => {
				//given : PRIVATE cabinetId
				const cabinetId = 1;
				const lentType = LentType.SHARE;

				//when : 변경 시도
				const response = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/lentType/${cabinetId}/${lentType}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				//잘 바뀌었는지 확인한다.
			});

			it('공유 사물함을 개인 사물함으로 변경합니다.', async () => {
				//given : SHARE cabinetId
				const cabinetId = 7;
				const lentType = LentType.PRIVATE;

				//when : 변경 시도
				const response = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/lentType/${cabinetId}/${lentType}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				//잘 바뀌었는지 확인한다.
				
			});
		});
	});

	describe('PATCH : api/admin/cabinet/statusNote/:cabinetId', () => {
		describe('정상적인 요청 - 사물함의 고장 사유를 변경합니다.', () => {
			it('사물함의 고장 사유를 변경합니다.', async () => {
				//given : BROKEN cabinetId, statusNote
				const cabinetId = 6;
				const statusNote = 'Got broken by ccabi!';

				//when : 변경 시도
				const body = {
					status_note: statusNote,
				};

				const response = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/statusNote/${cabinetId}`)
				.send(body)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				//타입이 잘 바뀌었는지 확인한다.
			});
		});
	});

	describe('PATCH : api/admin/catbinet/bundle/status/:status', () => {
		describe('정상적인 요청 - 배열에 담긴 cabinetId에 해당하는 사물함의 상태를 변경합니다.', () => {
			it('BROKEN, BANNED, EXPIRED인 사물함들을 AVAILABLE으로 변경합니다.', async () => {
				//given : BROKEN - 2, BANNED - 3, EXPIRED - 13
				const cabinetIdArray = [2, 3, 13];
				const status = CabinetStatusType.AVAILABLE;

				//when : 변경 시도
				const response = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/bundle/status/${status}`)
				.send(cabinetIdArray)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				//상태가 잘 바뀌었는지 체크한다.
			});
		});
	});

	describe('PATCH : api/admin/catbinet/:cabinetId/:title', () => {
		describe('정상적인 요청 - 사물함의 title을 변경합니다.', () => {
			it('title이 CABI인 사물함을 HELLO_CCABI로 변경합니다.', async () => {
				//given : cabinetId, title
				const cabinetId = 12;
				const title = 'HELLO_CABI';

				//when : 변경 시도
				const response = await request(app.getHttpServer())
				.patch(`/api/admin/cabinet/${cabinetId}/${title}`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				//title === HELLO_CABI
			});
		});
	});

	describe('GET : api/admin/catbinet/count/floor', () => {
		describe('정상적인 요청 - 전 층의 사물함 정보를 가져옵니다.', () => {
			it('2층, 4층, 5층에 있는 15개의 사물함 정보 배열을 가져옵니다.', async () => {
				//given : None

				//when : 변경 시도
				const response = await request(app.getHttpServer())
				.get(`/api/admin/cabinet/count/floor`)
				.set('Authorization', `Bearer ${token}`);

				//then : 200
				expect(response.status).toBe(HttpStatus.OK);
				
				//15개의 사물함 배열, 각각 ToBeDefined, 형식은 CabinetFloorDto
			});
		});
	});

	afterAll(async () => {
		app.close();
	  });
})