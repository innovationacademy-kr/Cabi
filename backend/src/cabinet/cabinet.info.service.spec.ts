import { Test, TestingModule } from "@nestjs/testing";
import { CabinetInfoService } from "src/cabinet/cabinet.info.service";
import { MockCabinetInfoRepository } from "src/cabinet/repository/mock/mock.cabinet.info.repository";
import { CabinetDto } from "src/dto/cabinet.dto";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import LentType from "src/enums/lent.type.enum";

const repository = {
    provide: 'ICabinetInfoRepository',
    useClass: MockCabinetInfoRepository,
}

class MockCabinetInfoService{
    constructor(
        public mockCabinetInfoRepository: MockCabinetInfoRepository,
    ){}
      async updateCabinetStatus(
        cabinetId: number,
        status: CabinetStatusType,
      ): Promise<void> {
        await this.mockCabinetInfoRepository.updateCabinetStatus(cabinetId, status);
      }
      async getCabinetInfo(cabinetId: number): Promise<CabinetDto> {
        return await this.mockCabinetInfoRepository.getCabinetInfo(cabinetId);
      }
}

describe('CabinetInfoService 테스트', () => {
    let cabinetInfoService: CabinetInfoService;
    let testService: MockCabinetInfoService;
    //테스트 메서드가 실행되기 전 beforeeach가 붙은 메서드에서 테스트에 필요한 객체를 새롭게 생성합니다.
    //테스트 클래스 내 메서드가 동일한 조건에서 실행되는 것을 보장하기 위함입니다.
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                CabinetInfoService,
                repository,
            ],
        }).compile();
        cabinetInfoService = app.get<CabinetInfoService>(CabinetInfoService);
        testService = new MockCabinetInfoService(new MockCabinetInfoRepository);
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
            const cabinetId = 2; // BROKEN
            const status = CabinetStatusType.AVAILABLE;

            await testService.updateCabinetStatus(cabinetId, status);
            expect(testService.mockCabinetInfoRepository.MockCabinetInfoEntity[2]['cabinet_status'])
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