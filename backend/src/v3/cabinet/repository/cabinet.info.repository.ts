import { InjectRepository } from '@nestjs/typeorm';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { CabinetsPerSectionResponseDto } from 'src/dto/response/cabinet.per.section.response.dto';
import Cabinet from 'src/entities/cabinet.entity';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { QueryRunner, Repository } from 'typeorm';
import { ICabinetInfoRepository } from './interface.cabinet.info.repository';

export class CabinetInfoRepository implements ICabinetInfoRepository {
  constructor(
    @InjectRepository(Cabinet)
    private cabinetInfoRepository: Repository<Cabinet>,
  ) {}

  async getLocation(): Promise<string[]> {
    const location = await this.cabinetInfoRepository
      .createQueryBuilder('cabinet')
      .select('cabinet.location')
      .distinct(true)
      .getRawMany();

    return location.map((l) => l.cabinet_location);
  }

  async getFloors(location: string): Promise<number[]> {
    const floors = await this.cabinetInfoRepository
      .createQueryBuilder('cabinet')
      .select('cabinet.floor')
      .distinct(true)
      .where('cabinet.location = :location', { location })
      .getRawMany();

    return floors.map((f) => f.cabinet_floor);
  }

  async getFloorInfo(
    location: string,
    floor: number,
  ): Promise<CabinetsPerSectionResponseDto[]> {
    const cabinets = await this.cabinetInfoRepository.find({
      where: {
        location,
        floor,
      },
    });

    const sections = await this.getSectionInfo(location, floor);
    const cabinetInfoDto = await Promise.all(
      cabinets.map((cabinet) =>
        this.getCabinetResponseInfo(cabinet.cabinet_id),
      ),
    );

    const rtn = sections.map((section) => ({
      section,
      cabinets: cabinetInfoDto.filter((cabinet) => cabinet.section === section),
    }));

    rtn.sort(
      (v1, v2) => v1.cabinets[0].cabinet_num - v2.cabinets[0].cabinet_num,
    );
    return rtn;
  }

  async getSectionInfo(location: string, floor: number): Promise<string[]> {
    const section = await this.cabinetInfoRepository
      .createQueryBuilder('cabinet')
      .select('cabinet.section')
      .distinct(true)
      .where('cabinet.location = :location', { location })
      .andWhere('cabinet.floor = :floor', { floor })
      .getRawMany();

    return section.map((s) => s.cabinet_section);
  }

  async getCabinetResponseInfo(
    cabinet_id: number,
  ): Promise<CabinetInfoResponseDto> {
    const cabinetInfo = await this.getCabinetInfo(cabinet_id);
    const lentInfo = await this.getLentUsers(cabinet_id);
    return {
      ...cabinetInfo,
      lent_info: lentInfo,
    };
  }

  async getCabinetInfo(cabinet_id: number): Promise<CabinetDto> {
    const cabinet = await this.cabinetInfoRepository.findOne({
      where: {
        cabinet_id,
      },
    });
    return {
      cabinet_id: cabinet.cabinet_id,
      cabinet_num: cabinet.cabinet_num,
      lent_type: cabinet.lent_type,
      cabinet_title: cabinet.title,
      max_user: cabinet.max_user,
      status: cabinet.status,
      section: cabinet.section,
    };
  }

  async getLentUsers(cabinet_id: number): Promise<LentDto[]> {
    const lentDto: LentDto[] = [];
    const lentInfo = await this.cabinetInfoRepository.findOne({
      relations: ['lent', 'lent.user'],
      where: {
        cabinet_id,
        lent: {
          cabinet: true,
        },
      },
    });
    if (!lentInfo) {
      return lentDto;
    }
    lentInfo.lent.forEach((lent) =>
      lentDto.push({
        user_id: lent.user.user_id,
        intra_id: lent.user.intra_id,
        lent_id: lent.lent_id,
        lent_time: lent.lent_time,
        expire_time: lent.expire_time,
        is_expired: false,
      }),
    );
    return lentDto;
  }

  async updateCabinetStatus(
    cabinet_id: number,
    status: CabinetStatusType,
    queryRunner?: QueryRunner,
  ): Promise<void> {
    await this.cabinetInfoRepository
      .createQueryBuilder(this.updateCabinetStatus.name, queryRunner)
      .update()
      .set({
        status,
      })
      .where({
        cabinet_id,
      })
      .execute();
    // const cabinet = await this.cabinetInfoRepository.findOne({
    //   where: {
    //     cabinet_id,
    //   },
    // });
    // cabinet.status = status;
    // await this.cabinetInfoRepository.save(cabinet);
  }
}
