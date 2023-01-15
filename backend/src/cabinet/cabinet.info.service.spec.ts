import { Test, TestingModule } from "@nestjs/testing";
import { CabinetInfoService } from "src/cabinet/cabinet.info.service";
import { MockCabinetInfoRepository } from "src/cabinet/repository/mock/mock.cabinet.info.repository";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import LentType from "src/enums/lent.type.enum";

// Mocking한 repository를 가져옵니다.
const mockRepository = {
    provide: 'ICabinetInfoRepository',
    useClass: MockCabinetInfoRepository,
}

// @Transactional 데코레이터를 모킹합니다.
jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => {},
    Propagation: {},
    IsolationLevel: {},
  }));

describe('CabinetInfoService 테스트', () => {
    let cabinetInfoService: CabinetInfoService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                CabinetInfoService,
                //cabinetInfoService에서 주입하는 repository를 MockCabinetInfoRepository로 설정합니다.
                mockRepository,
            ],
        }).compile();
        cabinetInfoService = app.get<CabinetInfoService>(CabinetInfoService);
    });

    describe('getCabinetInfo', () => {
        test('캐비닛 id로 해당 캐비닛의 CabinetDto 반환', async () => {
            const cabinetId = 1;

            const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);
            
            expect(cabinetInfo).toStrictEqual({
                cabinet_id: 1,
                cabinet_num: 100,
                location: '새롬관',
                floor: 1,
                section: 'Oasis',
                cabinet_status: CabinetStatusType.AVAILABLE,
                lent_type: LentType.CIRCLE,
                max_user: 1,
                min_user: 0,
                cabinet_title: 'Cabi팀 최고1',
                status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
            });
        });

        test('존재하지 않는 캐비닛 id로 조회', async () => {
            const cabinetId = 3306;
            
            const cabinetInfo = await cabinetInfoService.getCabinetInfo(cabinetId);

            expect(cabinetInfo).toBeUndefined();
        });
    });

    describe('updateCabinetStatus', () => {
        test('캐비닛 id에 해당하는 캐비닛의 상태를 status 인자로 설정', async () => {
            const cabinetId = 2;
            const status = CabinetStatusType.AVAILABLE;

            await cabinetInfoService.updateCabinetStatus(cabinetId, status);
            
            expect((await cabinetInfoService.getCabinetInfo(cabinetId))['cabinet_status'])
            .toBe(CabinetStatusType.AVAILABLE);
        });
    });

    describe('getLentUsers', () => {
        test('해당 캐비닛 id를 가진 캐비닛을 빌렸던 유저들의 LentDto 배열을 반환', async () => {
            const cabinetId = 2; // 'sanan', 'eunbikim'

            const lentUsers = await cabinetInfoService.getLentUsers(cabinetId);
            
            expect(Array.isArray(lentUsers)).toBe(true);
            expect(lentUsers[0].intra_id).toEqual('sanan');
            expect(lentUsers[1].intra_id).toEqual('eunbikim');
            expect(lentUsers[0].expire_time).toEqual('2023-01-13 20:00:00');
            expect(lentUsers[1].expire_time).toEqual('2023-01-13 20:00:00');
        });
    });
})