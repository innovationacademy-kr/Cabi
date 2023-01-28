import { Test, TestingModule } from '@nestjs/testing';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import { MockCabinetInfoRepository } from 'src/cabinet/repository/mock/mock.cabinet.info.repository';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

// Mocking한 repository를 가져옵니다.
const mockRepository = {
  provide: 'ICabinetInfoRepository',
  useClass: MockCabinetInfoRepository,
};

// @Transactional 데코레이터를 모킹합니다.
jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {
    forLint: 'forLint';
  },
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

  describe('getSpaceInfo', () => {
    test('DB에 SpaceInfo가 존재할 때 SpaceInfo를 조회', async () => {
      const spaceInfo = await cabinetInfoService.getSpaceInfo();

      expect(spaceInfo).toBeDefined();
      expect(spaceInfo.space_data).toContainEqual({
        location: '새롬관',
        floors: [1, 4],
      });
      expect(spaceInfo.space_data).toContainEqual({
        location: '마루관',
        floors: [2],
      });
      expect(spaceInfo.space_data).toContainEqual({
        location: '강민관',
        floors: [3],
      });
    });
  });

  describe('getCabinetInfoByParam', () => {
    test('존재하는 location과 floor로 사물함 조회', async () => {
      const location = '새롬관';
      const floor = 1;

      const cabinetInfoByParam = await cabinetInfoService.getCabinetInfoByParam(
        location,
        floor,
      );
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
      }).rejects.toThrow('존재하지 않는 사물함 영역입니다');
    });

    test('존재하지 않는 floor의 사물함 조회', async () => {
      const location = '새롬관';
      const floor = 99;

      expect(async () => {
        await cabinetInfoService.getCabinetInfoByParam(location, floor);
      }).rejects.toThrow();
      expect(async () => {
        await cabinetInfoService.getCabinetInfoByParam(location, floor);
      }).rejects.toThrow('존재하지 않는 사물함 영역입니다');
    });
  });
  describe('getCabinetResponseInfo', () => {
    test('존재하는 사물함 id의 responseinfo 조회', async () => {
      const cabinetId = 1;

      const cabinetResponseInfo =
        await cabinetInfoService.getCabinetResponseInfo(cabinetId);
      expect(cabinetResponseInfo).toBeDefined();
      expect(cabinetResponseInfo).toEqual({
        cabinet_id: 1,
        cabinet_num: 100,
        lent_type: 'CLUB',
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
            is_expired: false,
          },
          {
            user_id: 424242,
            intra_id: 'eunbikim',
            lent_id: 1235,
            lent_time: '2023-01-13 20:00:00',
            expire_time: '2023-01-13 21:00:00',
            is_expired: false,
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
      }).rejects.toThrow('존재하지 않는 사물함입니다');
    });
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
        lent_type: LentType.CLUB,
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

      expect(
        (await cabinetInfoService.getCabinetInfo(cabinetId))['cabinet_status'],
      ).toBe(CabinetStatusType.AVAILABLE);
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
});
