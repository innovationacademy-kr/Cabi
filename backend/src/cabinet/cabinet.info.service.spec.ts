import { Test, TestingModule } from "@nestjs/testing";
import { CabinetInfoService } from "./cabinet.info.service";
import { MockCabinetInfoRepository } from "src/cabinet/repository/mock/mock.cabinet.info.repository";
import { HttpStatus } from "@nestjs/common";

const repository = {
    provide: 'ICabinetInfoRepository',
    useClass: MockCabinetInfoRepository,
}

describe('CabinetInfoService 테스트', () => {
    let cabinetInfoService: CabinetInfoService;

//테스트 메서드가 실행되기 전 beforeeach가 붙은 메서드에서 테스트에 필요한 객체를 새롭게 생성합니다.
//테스트 클래스 내 메서드가 동일한 조건에서 실행되는 것을 보장하기 위함입니다.
    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                CabinetInfoService,
                repository,
            ],
        }).compile();

        cabinetInfoService = app.get<CabinetInfoService>(CabinetInfoService);
    });

    describe('getSpaceInfo', () => {
        test('DB에 SpaceInfo가 존재할 때 SpaceInfo를 조회', async () => {
            const spaceInfo = await cabinetInfoService.getSpaceInfo();

            expect(spaceInfo).toBeDefined();
            expect(spaceInfo.space_data).toContainEqual({location: '새롬관',floors:[1,4],});
            expect(spaceInfo.space_data).toContainEqual({location: '마루관',floors:[2],});
            expect(spaceInfo.space_data).toContainEqual({location: '강민관',floors:[3],});
        });
    });

    describe('getCabinetInfoByParam', () => {
        test('존재하는 location과 floor로 사물함 조회', async () => {
            const location = '새롬관';
            const floor = 1;

            const cabinetInfoByParam = await cabinetInfoService.getCabinetInfoByParam(location, floor);
            expect(cabinetInfoByParam).toBeDefined();
            expect(cabinetInfoByParam[0].section).toBe('Oasis');
        });

        test('존재하지 않는 location의 사물함 조회', async () => {
            const location = '카비관';
            const floor = 1;

            expect(async () => {
                await cabinetInfoService.getCabinetInfoByParam(location, floor);
            }).rejects.toThrow();
            expect(async () => {
                await cabinetInfoService.getCabinetInfoByParam(location, floor);
            }).rejects.toThrow('🚨 존재하지 않는 사물함 영역입니다 🚨');
        });

        test('존재하지 않는 floor의 사물함 조회', async () => {
            const location = '새롬관';
            const floor = 99;

            expect(async () => {
                await cabinetInfoService.getCabinetInfoByParam(location, floor);
            }).rejects.toThrow();
            expect(async () => {
                await cabinetInfoService.getCabinetInfoByParam(location, floor);
            }).rejects.toThrow('🚨 존재하지 않는 사물함 영역입니다 🚨');
        })
    });

    describe('getCabinetResponseInfo', () => {
        test('존재하는 사물함 id의 responseinfo 조회', async () => {
            const cabinetId = 1;

            const cabinetResponseInfo = await cabinetInfoService.getCabinetResponseInfo(cabinetId);
            expect(cabinetResponseInfo).toBeDefined();
            expect(cabinetResponseInfo).toEqual({
                cabinet_id: 1,
                cabinet_num: 100,
                lent_type: 'CIRCLE',
                cabinet_title: undefined,
                max_user: 1,
                status: undefined,
                location: '새롬관',
                floor: 1,
                section: 'Oasis',
                lent_info: [
                    {
                    user_id: 131541,
                    intra_id: 'sanan',
                    lent_id: 1234,
                    lent_time: '2023-01-13 20:00:00',
                    expire_time: '2023-01-13 21:00:00',
                    is_expired: false
                  },
                  {
                    user_id: 424242,
                    intra_id: 'eunbikim',
                    lent_id: 1235,
                    lent_time: '2023-01-13 20:00:00',
                    expire_time: '2023-01-13 21:00:00',
                    is_expired: false
                  },
                ],
              });
        });

        test('존재하지 않는 사물함 id의 responseinfo 조회', async () => {
           const cabinetId = 999;

            expect(async () => {
            await cabinetInfoService.getCabinetResponseInfo(cabinetId);
            }).rejects.toThrow();
            expect(async () => {
                await cabinetInfoService.getCabinetResponseInfo(cabinetId);
            }).rejects.toThrow('🚨 존재하지 않는 사물함입니다 🚨');
        });
    })
})