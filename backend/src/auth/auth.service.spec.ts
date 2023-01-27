import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

const configServiceForFalse = {
  provide: ConfigService,
  useValue: {
    get: jest.fn(() => false),
  },
};

const mockCahceManager = {
  provide: CACHE_MANAGER,
  useValue: {
    set: jest.fn(),
    get: jest.fn((key) => {
      if (key === 'user-2') return true;
      else return undefined;
    }),
  },
};

const mockEventEmitter = {
  provide: EventEmitter2,
  useValue: {
    emit: jest.fn(),
  },
};

const mockAuthRepository = {
  provide: 'IAuthRepository',
  useValue: {
    addUserIfNotExists: jest.fn(async (user, blackholed) => {
      if (user.intra_id === 'firstUser') return false;
      else return true;
    }),
    checkUserBorrowed: jest.fn().mockResolvedValue(true),
    checkUserExists: jest.fn().mockResolvedValue(true),
  },
};

let authService: AuthService;

const notExistedUser = {
  user_id: 1,
  intra_id: 'firstUser',
  email: 'intra@student.42seoul.kr',
};

const existedUser = {
  user_id: 2,
  intra_id: 'secondUser',
  email: 'intra@student.42seoul.kr',
};

describe('AuthService class', () => {
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        configServiceForFalse,
        mockCahceManager,
        mockAuthRepository,
        mockEventEmitter,
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUserIfNotExist method', () => {
    it('유저 한명 추가', async () => {
      const result = await authService.addUserIfNotExists(notExistedUser);
      expect(result).resolves.toBeFalsy;
      expect(mockAuthRepository.useValue.addUserIfNotExists).toBeCalled();
      expect(mockEventEmitter.useValue.emit).toBeCalledWith(
        'user.created',
        notExistedUser,
      );
      expect(mockCahceManager.useValue.set).toBeCalledWith(
        `user-${notExistedUser.user_id}`,
        true,
        { ttl: 0 },
      );
    });

    it('존재하는 유저 추가', async () => {
      const result = await authService.addUserIfNotExists(existedUser);
      expect(result).resolves.toBeTruthy;
      expect(mockAuthRepository.useValue.addUserIfNotExists).toBeCalled();
      expect(mockEventEmitter.useValue.emit).not.toBeCalled();
      expect(mockCahceManager.useValue.set).toBeCalledWith(
        `user-${existedUser.user_id}`,
        true,
        { ttl: 0 },
      );
    });
  });

  describe('checkUserBorrowed method', () => {
    it('repository의 checkUserBorrowed가 재대로 실행되는지 확인', async () => {
      const result = await authService.checkUserBorrowed(existedUser);
      expect(result).resolves.toBeTruthy;
      expect(mockAuthRepository.useValue.checkUserBorrowed).toBeCalled();
    });
  });

  describe('checkUserExists', () => {
    it('캐시에 존재하는 유저 테스트', async () => {
      const result = await authService.checkUserExists(existedUser.user_id);
      expect(result).resolves.toBeTruthy;
      expect(mockCahceManager.useValue.get).toBeCalled();
    });

    it('캐시에 존재하지 않는 유저 테스트', async () => {
      const result = await authService.checkUserExists(notExistedUser.user_id);
      expect(result).resolves.toBeTruthy;
      expect(mockCahceManager.useValue.set).toBeCalledWith(
        `user-${notExistedUser.user_id}`,
        true,
        { ttl: 0 },
      );
    });
  });
});
