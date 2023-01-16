import { Injectable } from '@nestjs/common';
import { ICabinetInfoRepository } from 'src/cabinet/repository/cabinet.info.interface.repository';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { CabinetsPerSectionResponseDto } from 'src/dto/response/cabinet.per.section.response.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import LentType from 'src/enums/lent.type.enum';

@Injectable()
export class MockCabinetInfoRepository implements ICabinetInfoRepository {
  MockCabinetInfoEntity: any[] = [];
  MockLentEntity: any[] = [];

  constructor() {
    this.MockCabinetInfoEntity.push({
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
    this.MockCabinetInfoEntity.push({
      cabinet_id: 2,
      cabinet_num: 42,
      location: '마루관',
      floor: 2,
      section: 'Terrace',
      cabinet_status: CabinetStatusType.BROKEN,
      lent_type: LentType.PRIVATE,
      max_user: 1,
      min_user: 0,
      cabinet_title: 'Cabi팀 최고2',
      status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
    });
    this.MockCabinetInfoEntity.push({
      cabinet_id: 3,
      cabinet_num: 84,
      location: '강민관',
      floor: 3,
      section: 'Universe',
      cabinet_status: CabinetStatusType.AVAILABLE,
      lent_type: LentType.SHARE,
      max_user: 3,
      min_user: 0,
      cabinet_title: 'Cabi팀 최고3',
      status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
    });
    this.MockCabinetInfoEntity.push({
      cabinet_id: 4,
      cabinet_num: 21,
      location: '새롬관',
      floor: 4,
      section: 'Cluster',
      cabinet_status: CabinetStatusType.BANNED,
      lent_type: LentType.PRIVATE,
      max_user: 1,
      min_user: 0,
      cabinet_title: 'Cabi팀 최고4',
      status_note: '난 너를 믿었던 만큼 난 내 친구도 믿었기에',
    });
    //LentRepository를 Mocking 합니다. + cabinet_id 추가
    this.MockLentEntity.push({
      user_id: 131541,
      intra_id: 'sanan',
      cabinet_id: 1,
      lent_id: 1234,
      lent_time: '2023-01-13 20:00:00',
      expire_time: '2023-01-13 21:00:00',
      is_expired: false,
    });
    this.MockLentEntity.push({
      user_id: 131541,
      intra_id: 'sanan',
      cabinet_id: 2,
      lent_id: 4321,
      lent_time: '2023-01-13 19:00:00',
      expire_time: '2023-01-13 20:00:00',
      is_expired: true,
    });
    this.MockLentEntity.push({
      user_id: 424242,
      intra_id: 'eunbikim',
      cabinet_id: 1,
      lent_id: 1235,
      lent_time: '2023-01-13 20:00:00',
      expire_time: '2023-01-13 21:00:00',
      is_expired: false,
    });
    this.MockLentEntity.push({
      user_id: 424242,
      intra_id: 'eunbikim',
      cabinet_id: 2,
      lent_id: 5321,
      lent_time: '2023-01-13 19:00:00',
      expire_time: '2023-01-13 20:00:00',
      is_expired: true,
    });
  }

  async getLocation(): Promise<string[]> {
    const location: string[] = [];
    return location;
  }

  async getFloors(location: string): Promise<number[]> {
    const floors = [];

    return floors.map((f) => f.cabinet_floor);
  }

  async getFloorInfo(
    location: string,
    floor: number,
  ): Promise<CabinetsPerSectionResponseDto[]> {
    const cabinets = [];
    return cabinets;
  }

  async getSectionInfo(location: string, floor: number): Promise<string[]> {
    const section = [];
    return section;
  }

  async getCabinetResponseInfo(
    cabinet_id: number,
  ): Promise<CabinetInfoResponseDto> {
    const result = undefined;
    return result;
  }

  async getCabinetInfo(cabinet_id: number): Promise<CabinetDto> {
    const ret = this.MockCabinetInfoEntity.find(
      (target) => target.cabinet_id === cabinet_id,
    );
    return ret;
  }

  async updateCabinetStatus(
    cabinet_id: number,
    status: CabinetStatusType,
  ): Promise<void> {
    this.MockCabinetInfoEntity.find(
      (cabinetData) => cabinetData.cabinet_id === cabinet_id,
    )['cabinet_status'] = status;
  }

  async getLentUsers(cabinet_id: number): Promise<LentDto[]> {
    const ret = this.MockLentEntity.filter(
      (lentData) => lentData.cabinet_id === cabinet_id,
    ).map(
      (target): LentDto => ({
        user_id: target.user_id,
        intra_id: target.intra_id,
        lent_id: target.lent_id,
        lent_time: target.lent_time,
        expire_time: target.expire_time,
        is_expired: target.is_expired,
      }),
    );
    return ret;
  }
}
