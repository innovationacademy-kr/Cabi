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
    const allLocation = this.MockCabinetInfoEntity.map((c) => c.location);
    const setLocation = new Set(allLocation);
    const location = [...setLocation];
    return location;
  }

  async getFloors(location: string): Promise<number[]> {
    let allFloors = this.MockCabinetInfoEntity.filter((c) => {
      if (c.location === location) {
        return true;
      }
    });
    allFloors = allFloors.map((c) => c.floor);
    const setFloors = new Set(allFloors);
    const floors = [...setFloors];
    return floors;
  }

  async getFloorInfo(
    location: string,
    floor: number,
  ): Promise<CabinetsPerSectionResponseDto[]> {
    const sections = await this.getSectionInfo(location, floor);
    let cabinetId = this.MockCabinetInfoEntity.filter((c) => {
      if (c.location === location && c.floor === floor) return true;
    });
    cabinetId = cabinetId.map((c) => c.cabinet_id);
    const cabinetInfoDto = [];
    for (const id of cabinetId) {
      cabinetInfoDto.push(await this.getCabinetResponseInfo(id));
    }
    const rtn = sections.map((section) => ({
      section,
      cabinets: cabinetInfoDto.filter((cabinet) => cabinet.section === section),
    }));
    for (const section of rtn) {
      section.cabinets.sort((v1, v2) => v1.cabinet_num - v2.cabinet_num);
    }

    rtn.sort(
      (v1, v2) => v1.cabinets[0].cabinet_num - v2.cabinets[0].cabinet_num,
    );
    return rtn;
  }

  async getSectionInfo(location: string, floor: number): Promise<string[]> {
    let allSection = this.MockCabinetInfoEntity.filter((c) => {
      if (c.location === location && c.floor === floor) {
        return true;
      }
    });
    allSection = allSection.map((c) => c.section);
    const setSection = new Set(allSection);
    const sections = [...setSection];
    return sections;
  }

  async getCabinetResponseInfo(
    cabinet_id: number,
  ): Promise<CabinetInfoResponseDto> {
    const cabinetInfo = this.MockCabinetInfoEntity.find(
      (c) => c.cabinet_id === cabinet_id,
    );
    const lentInfo = this.MockLentEntity.filter(
      (l) => l.cabinet_id === cabinet_id,
    );
    const cabinetInfoResponse = {
      cabinet_id: cabinetInfo.cabinet_id,
      cabinet_num: cabinetInfo.cabinet_num,
      lent_type: cabinetInfo.lent_type,
      cabinet_title: cabinetInfo.title,
      max_user: cabinetInfo.max_user,
      status: cabinetInfo.status,
      location: cabinetInfo.location,
      floor: cabinetInfo.floor,
      section: cabinetInfo.section,
      lent_info: lentInfo
        ? lentInfo.map((l) => ({
            user_id: l.user_id,
            intra_id: l.intra_id,
            lent_id: l.lent_id,
            lent_time: l.lent_time,
            expire_time: l.expire_time,
            is_expired: new Date() > l.expire_time,
          }))
        : [],
    };
    return cabinetInfoResponse;
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
