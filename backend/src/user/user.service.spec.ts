import { UserService } from './user.service';
import { MockUserRepository } from './repository/mock/mock.user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/common';
import { CabinetInfoService } from 'src/cabinet/cabinet.info.service';

const repository = {
  provide: 'IUserRepository',
  useClass: MockUserRepository,
};

const cache = {
  provide: CACHE_MANAGER,
  useValue: {
    delete: jest.fn(),
  },
};

const cabinetInfoService = {
  provide: CabinetInfoService,
  useValue: {
    getLentUsers: jest.fn(),
  },
};

jest.mock('typeorm-transactional' as any, () => ({
  Transactional: () => () => {},
  Propagation: {},
  IsolationLevel: {},
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, repository, cache, cabinetInfoService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  // describe('getCabinetByUserId', () => {
  //   it('should return null if user does not have cabinet', async () => {
  //     const result = await userService.getCabinetByUserId(1);
  //     expect(result).toBeNull();
  //   });
  // });

  describe('getCabinetDtoByUserId', () => {
    it('should return not null if user has cabinet', async () => {
      const result = await userService.getCabinetDtoByUserId(1);
      expect(result).toBeDefined();
    });
  });
});
