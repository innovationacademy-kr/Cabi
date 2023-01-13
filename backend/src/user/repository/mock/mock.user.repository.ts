import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { CabinetExtendDto } from 'src/dto/cabinet.extend.dto';

export class MockUserEntity {
  user_id: number;
  intra_id: string;
  email: string;
  first_login: Date;
  last_login: Date;
  blackhole_date: Date | null;
}

@Injectable()
export class MockUserRepository implements IUserRepository {
  mockUserEntity: MockUserEntity[] = [];

  constructor() {
    const now = new Date();
    const 블랙홀에_빠진_사람의_blackhole_date = new Date('2000-02-21');
    const 아직_블랙홀에_빠지지_않은_사람의_blackhole_date = new Date(
      '9999-12-31',
    );
    // Member인 유저 Mock data (blackhole_date가 null)
    this.mockUserEntity.push({
      user_id: 1,
      intra_id: 'hyoon',
      email: 'hyoon@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 2,
      intra_id: 'spark',
      email: 'spark@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 3,
      intra_id: 'skim',
      email: 'skim@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 4,
      intra_id: 'inshin',
      email: 'inshin@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 5,
      intra_id: 'hyospark',
      email: 'hyospark@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 6,
      intra_id: 'hybae',
      email: 'hybae@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 7,
      intra_id: 'huchoi',
      email: 'huchoi@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    this.mockUserEntity.push({
      user_id: 8,
      intra_id: 'joopark',
      email: 'joopark@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: null,
    });
    // Learner인 유저 Mock data (아직 블랙홀에 빠지지 않은 유저)
    this.mockUserEntity.push({
      user_id: 9,
      intra_id: 'sichoi',
      email: 'sichoi@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 10,
      intra_id: 'eunbikim',
      email: 'eunbikim@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 11,
      intra_id: 'jaesjeon',
      email: 'jaesjeon@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 12,
      intra_id: 'sanan',
      email: 'sanan@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 13,
      intra_id: 'seycho',
      email: 'seycho@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 14,
      intra_id: 'yooh',
      email: 'yooh@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 15,
      intra_id: 'yubchoi',
      email: 'yubchoi@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 16,
      intra_id: 'dongglee',
      email: 'dongglee@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 아직_블랙홀에_빠지지_않은_사람의_blackhole_date,
    });
    // Learner인 유저 Mock data (블랙홀에 빠진 유저)
    this.mockUserEntity.push({
      user_id: 17,
      intra_id: 'gyuwlee',
      email: 'gyuwlee@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 블랙홀에_빠진_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 18,
      intra_id: 'jiwchoi',
      email: 'jiwchoi@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 블랙홀에_빠진_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 19,
      intra_id: 'seuan',
      email: 'seuan@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 블랙홀에_빠진_사람의_blackhole_date,
    });
    this.mockUserEntity.push({
      user_id: 20,
      intra_id: 'yoyoo',
      email: 'yoyoo@test.com',
      first_login: now,
      last_login: now,
      blackhole_date: 블랙홀에_빠진_사람의_blackhole_date,
    });
  }
}
