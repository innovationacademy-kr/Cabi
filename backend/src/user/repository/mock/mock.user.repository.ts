import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user.repository.interface';
import { CabinetExtendDto } from 'src/dto/cabinet.extend.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { UserDto } from 'src/dto/user.dto';
import LentType from 'src/enums/lent.type.enum';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';

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

  async getCabinetByUserId(userId: number): Promise<CabinetExtendDto | null> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return null;
    }
    // TODO: MockCabinetEntity가 구현되면 멤버 변수로 추가
    // const cabinet = this.mockCabinetEntity.find(
    //   (cabinet) => cabinet.user_id === userId,
    // );
    // FIXME: MockCabinetEntity가 구현되어 있지 않아 '가짜로 구현하기'를 적용했습니다.
    // 구현 완료 후 삭제가 필요합니다.
    const cabinet = {
      cabinet_id: 1,
      cabinet_num: 1,
      lent_type: LentType.PRIVATE,
      cabinet_title: '가짜 캐비넷 제목',
      max_user: 1,
      status: CabinetStatusType.SET_EXPIRE_FULL,
      location: '가짜 캐비넷 위치',
      floor: 2,
      section: '가짜 캐비넷 구역',
      cabinet_memo: '가짜 캐비넷 메모',
    };

    if (!cabinet) {
      return null;
    }
    return {
      cabinet_id: cabinet.cabinet_id,
      cabinet_num: cabinet.cabinet_num,
      lent_type: cabinet.lent_type,
      cabinet_title: cabinet.cabinet_title,
      max_user: cabinet.max_user,
      status: cabinet.status,
      location: cabinet.location,
      floor: cabinet.floor,
      section: cabinet.section,
      cabinet_memo: cabinet.cabinet_memo,
    };
  }

  async checkUserBorrowed(userId: number): Promise<number> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return -1;
    }
    // TODO: MockLentEntity에서 구현되면 멤버 변수로 추가
    // const lent = this.mockLentEntity.find((lent) => lent.user_id === userId);
    // FIXME: MockLentEntity에서 구현되어 있지 않아 '가짜로 구현하기'를 적용했습니다.
    // 구현 완료 후 삭제가 필요합니다.
    const lent = {
      lent_id: 1,
      lent_user_id: userId,
      lent_cabinet_id: 1,
      lent_time: new Date(),
      expire_time: new Date(),
    };
    // mockLentEntity에서 user_id에 해당하는 값을 찾는다. 존재하면 cabinet_id를 반환한다.
    if (!lent) {
      return -1;
    }
    return lent.lent_cabinet_id;
  }

  async getAllUser(): Promise<UserSessionDto[]> {
    return this.mockUserEntity.map((user) => {
      return {
        user_id: user.user_id,
        intra_id: user.intra_id,
        blackhole_date: user.blackhole_date,
      };
    });
  }

  async getCabinetDtoByUserId(userId: number): Promise<CabinetDto | null> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return null;
    }
    // TODO: MockLentEntity에서 구현되면 멤버 변수로 추가
    // const lent = this.mockLentEntity.find((lent) => lent.user_id === userId);
    // FIXME: MockLentEntity에서 구현되어 있지 않아 '가짜로 구현하기'를 적용했습니다.
    // 구현 완료 후 삭제가 필요합니다.
    const lent = {
      lent_id: 1,
      lent_user_id: userId,
      lent_cabinet_id: 1,
      lent_time: new Date(),
      expire_time: new Date(),
    };
    // TODO: MockCabinetEntity가 구현되면 멤버 변수로 추가
    // const cabinet = this.mockCabinetEntity.find(
    //   (cabinet) => cabinet.cabinet_id === lent.lent_cabinet_id,
    // );
    // FIXME: MockCabinetEntity가 구현되어 있지 않아 '가짜로 구현하기'를 적용했습니다.
    // 구현 완료 후 삭제가 필요합니다.
    const cabinet = {
      cabinet_id: 1,
      cabinet_num: 1,
      lent_type: LentType.PRIVATE,
      cabinet_title: '가짜 캐비넷 제목',
      max_user: 1,
      status: CabinetStatusType.SET_EXPIRE_FULL,
      location: '가짜 캐비넷 위치',
      floor: 2,
      section: '가짜 캐비넷 구역',
      cabinet_memo: '가짜 캐비넷 메모',
    };
    if (!cabinet) {
      return null;
    }
    return {
      cabinet_id: cabinet.cabinet_id,
      cabinet_num: cabinet.cabinet_num,
      lent_type: cabinet.lent_type,
      cabinet_title: cabinet.cabinet_title,
      max_user: cabinet.max_user,
      status: cabinet.status,
      section: cabinet.section,
    };
  }

  async deleteUserById(userId: number): Promise<void> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return;
    }
    this.mockUserEntity = this.mockUserEntity.filter(
      (user) => user.user_id !== userId,
    );
  }

  async updateBlackholeDate(
    userId: number,
    blackholeDate: Date,
  ): Promise<void> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return;
    }
    user.blackhole_date = blackholeDate;
  }

  async getUserIfExist(userId: number): Promise<UserDto> {
    const user = this.mockUserEntity.find((user) => user.user_id === userId);
    if (!user) {
      return null;
    }
    return {
      user_id: user.user_id,
      intra_id: user.intra_id,
    };
  }
}
