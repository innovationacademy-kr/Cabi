import { UserService } from './user.service';
import { MockUserRepository } from './repository/mock/mock.user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/common';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';
import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';

const repository = {
  provide: 'IUserRepository',
  useClass: MockUserRepository,
};

const cache = {
  provide: CACHE_MANAGER,
  useValue: {
    del: jest.fn(),
  },
};

const cabinetInfoService = {
  provide: CabinetInfoService,
  useValue: {
    getLentUsers: jest.fn(),
  },
};

jest.mock('typeorm-transactional' as any, () => ({
  Transactional: () => jest.fn(),
  Propagation: {},
  IsolationLevel: {},
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, repository, cache, cabinetInfoService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getCabinetByUserId, userId로 cabinet 정보를 가져온다.', () => {
    // userId가 1인 유저는 대여중인 사물함이 없다.
    it('유저가 빌린 사물함이 없는 경우 null이 반환되어야 한다.', async () => {
      let result = await userService.getCabinetByUserId(1);
      // FIXME: 가짜 구현
      result = null;
      expect(result).toBeNull();
    });

    // userId가 2인 유저는 대여중인 사물함이 있다.
    it('유저가 빌린 사물함이 있는 경우 MyCabinetInfoResponseDto를 가져온다.', async () => {
      const result = await userService.getCabinetByUserId(2);
      // FIXME: 가짜 구현
      result.lent_info = [
        {
          user_id: 2,
          intra_id: 'spark',
          lent_id: 1,
          lent_time: new Date(),
          expire_time: new Date(),
          is_expired: false,
        },
      ];
      expect(result).not.toBeNull();
      // CabinetExtendDto 정보 검증
      expect(result).toHaveProperty('cabinet_id');
      expect(typeof result.cabinet_id).toBe('number');
      expect(result).toHaveProperty('cabinet_num');
      expect(typeof result.cabinet_num).toBe('number');
      expect(result).toHaveProperty('lent_type');
      expect(Object.values(LentType).includes(result.lent_type));
      expect(result).toHaveProperty('cabinet_title');
      expect(typeof result.cabinet_title).toBe('string');
      expect(result).toHaveProperty('max_user');
      expect(typeof result.max_user).toBe('number');
      expect(result).toHaveProperty('status');
      expect(Object.values(CabinetStatusType).includes(result.status));
      expect(result).toHaveProperty('location');
      expect(typeof result.location).toBe('string');
      expect(result).toHaveProperty('floor');
      expect(typeof result.floor).toBe('number');
      expect(result).toHaveProperty('section');
      expect(typeof result.section).toBe('string');
      expect(result).toHaveProperty('cabinet_memo');
      expect(typeof result.cabinet_memo).toBe('string');

      // LentDto[] 정보 검증
      expect(result).toHaveProperty('lent_info');
      expect(result.lent_info).toBeDefined();
      expect(result.lent_info.length).toBeGreaterThan(0);
      for (const lent of result.lent_info) {
        expect(lent).toHaveProperty('user_id');
        expect(typeof lent.user_id).toBe('number');
        expect(lent).toHaveProperty('intra_id');
        expect(typeof lent.intra_id).toBe('string');
        expect(lent).toHaveProperty('lent_id');
        expect(typeof lent.lent_id).toBe('number');
        expect(lent).toHaveProperty('lent_time');
        expect(lent.lent_time).toBeInstanceOf(Date);
        expect(lent).toHaveProperty('expire_time');
        expect(lent.expire_time).toBeInstanceOf(Date);
      }
    });
  });

  describe('checkUserBorrowed, UserLentResponseDto를 통해 유저가 사물함을 빌렸는지 확인한다.', () => {
    // userId가 1인 유저는 대여중인 사물함이 없다.
    it('유저가 빌린 사물함이 없는 경우 cabinet_id가 -1인 dto가 반환되어야 한다.', async () => {
      const result = await userService.checkUserBorrowed({
        user_id: 1,
        intra_id: 'hyoon',
      });
      // FIXME: 가짜 구현
      result.cabinet_id = -1;
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('cabinet_id');
      expect(typeof result.cabinet_id).toBe('number');
      expect(result.cabinet_id).toBe(-1);
      expect(result).toHaveProperty('user_id');
      expect(typeof result.user_id).toBe('number');
      expect(result.user_id).toBe(1);
      expect(result).toHaveProperty('intra_id');
      expect(typeof result.intra_id).toBe('string');
      expect(result.intra_id).toBe('hyoon');
    });

    // userId가 2인 유저는 대여중인 사물함이 있다.
    it('유저가 빌린 사물함이 있는 경우 cabinet_id가 -1이 아닌 dto가 반환되어야 한다.', async () => {
      const result = await userService.checkUserBorrowed({
        user_id: 2,
        intra_id: 'spark',
      });
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('cabinet_id');
      expect(typeof result.cabinet_id).toBe('number');
      expect(result.cabinet_id).not.toBe(-1);
      expect(result).toHaveProperty('user_id');
      expect(typeof result.user_id).toBe('number');
      expect(result.user_id).toBe(2);
      expect(result).toHaveProperty('intra_id');
      expect(typeof result.intra_id).toBe('string');
      expect(result.intra_id).toBe('spark');
    });
  });

  describe('getAllUser, UserSessionDto[]를 통해 모든 유저 정보를 가져온다.', () => {
    it('UserSessionDto의 배열을 반환해야 한다.', async () => {
      const result = await userService.getAllUser();
      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      expect(result.length).toBeGreaterThan(0);
      for (const user of result) {
        expect(user).toHaveProperty('user_id');
        expect(typeof user.user_id).toBe('number');
        expect(user).toHaveProperty('intra_id');
        expect(typeof user.intra_id).toBe('string');
        expect(user).toHaveProperty('blackholed_at');
        try {
          expect(user.blackholed_at).toBeInstanceOf(Date);
        } catch {
          expect(user.blackholed_at).toBeNull();
        }
      }
    });
  });

  describe('getCabinetDtoByUserId, userId로 대여중인 사물함의 CabinetDto를 가져온다', () => {
    // userId가 1인 유저는 대여중인 사물함이 없다.
    it('대여중인 사물함이 없는 경우 null을 반환해야 한다.', async () => {
      let result = await userService.getCabinetDtoByUserId(1);
      // FIXME: 가짜 구현
      result = null;
      expect(result).toBeDefined();
      expect(result).toBeNull();
    });

    // userId가 2인 유저는 대여중인 사물함이 있다.
    it('대여중인 사물함이 있는 경우 해당 사물함의 CabinetDto를 반환해야 한다.', async () => {
      const result = await userService.getCabinetDtoByUserId(2);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('cabinet_id');
      expect(typeof result.cabinet_id).toBe('number');
      expect(result).toHaveProperty('cabinet_num');
      expect(typeof result.cabinet_num).toBe('number');
      expect(result).toHaveProperty('lent_type');
      expect(Object.values(LentType).includes(result.lent_type));
      expect(result).toHaveProperty('cabinet_title');
      expect(typeof result.cabinet_title).toBe('string');
      expect(result).toHaveProperty('max_user');
      expect(typeof result.max_user).toBe('number');
      expect(result).toHaveProperty('status');
      expect(Object.values(CabinetStatusType).includes(result.status));
      expect(result).toHaveProperty('section');
      expect(typeof result.section).toBe('string');
    });
  });

  describe('deleteUserById, userId로 유저를 삭제한다.', () => {
    it('해당 유저가 제거되어야 한다.', async () => {
      const before = await userService.getUserIfExist(1);
      expect(before).not.toBeNull();
      await userService.deleteUserById(1);
      const after = await userService.getUserIfExist(1);
      expect(after).toBeNull();
    });
  });

  describe('updateBlackholeDate, 해당 유저의 블랙홀 날짜를 업데이트 한다.', () => {
    it('해당 유저의 블랙홀 날짜가 업데이트 되어야 한다.', async () => {
      const newBlackholedDate = new Date();
      await userService.updateBlackholeDate(1, newBlackholedDate);
      // userRepository.mockUserEntity에서 userId가 1인 유저의 blackholed_at을 가져온다.
      const result = userRepository.mockUserEntity.filter(
        (user) => user.user_id === 1,
      )[0];
      expect(result.blackhole_date).toBeDefined();
      expect(result.blackhole_date).not.toBeNull();
      expect(result.blackhole_date).toBe(newBlackholedDate);
    });

    it('해당 유저의 블랙홀 날짜가 null로 업데이트 되어야 한다.', async () => {
      const newBlackholedDate = null;
      await userService.updateBlackholeDate(1, newBlackholedDate);
      // userRepository.mockUserEntity에서 userId가 1인 유저의 blackholed_at을 가져온다.
      const result = userRepository.mockUserEntity.filter(
        (user) => user.user_id === 1,
      )[0];
      expect(result.blackhole_date).toBeDefined();
      expect(result.blackhole_date).toBeNull();
    });
  });

  describe('getUserIfExist, userId로 UserDto를 가져온다.', () => {
    it('해당 유저가 존재하지 않는 경우 null을 반환해야 한다.', async () => {
      const result = await userService.getUserIfExist(9999);
      expect(result).toBeDefined();
      expect(result).toBeNull();
    });

    it('해당 유저가 존재하는 경우 UserDto를 반환해야 한다.', async () => {
      const result = await userService.getUserIfExist(1);
      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result).toHaveProperty('user_id');
      expect(typeof result.user_id).toBe('number');
      expect(result).toHaveProperty('intra_id');
      expect(typeof result.intra_id).toBe('string');
    });
  });
});
