import { InjectRepository } from '@nestjs/typeorm';
import { LentDto } from 'src/dto/lent.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { LentInfoResponseDto } from 'src/dto/response/lent.info.response.dto';
import Cabinet from 'src/entities/cabinet.entity';
import { Repository } from 'typeorm';
import { ICabinetInfoRepository } from './cabinet.info.repository.interface';

export class CabinetInfoRepository implements ICabinetInfoRepository {
  constructor(
    @InjectRepository(Cabinet)
    private cabinetInfoRepository: Repository<Cabinet>,
  ) {}

  async getFloorInfo(
    location: string,
    floor: number,
  ): Promise<LentInfoResponseDto> {
    const cabinets = await this.cabinetInfoRepository.find({
      where: {
        location,
        floor,
      },
    });
    // TODO: section 저장은 어디서하는지..?
    const section = [
      'Oasis',
      'End of Cluster 2',
      'Cluster 1 - OA',
      'End of Cluster 1',
      'Cluster 1 - Terrace',
    ];
    const cabinetInfoDto = await Promise.all(
      cabinets.map((cabinet) => this.getCabinetResponseInfo(cabinet.cabinet_id)),
    );
    return {
      section,
      cabinets: cabinetInfoDto,
    };
  }

  async getCabinetResponseInfo(cabinet_id: number): Promise<CabinetInfoResponseDto> {
    const cabinetInfo = await this.cabinetInfoRepository.findOne({
      where: {
        cabinet_id,
      },
    });
    // TODO: lent_info 가져오는 로직이 어디에 repository에 포함되어야 하는지, service에 포함되어야하는지..
    const cabinetInfoDto: CabinetInfoResponseDto = {
      cabinet_id: cabinetInfo.cabinet_id,
      cabinet_num: cabinetInfo.cabinet_num,
      lent_type: cabinetInfo.lent_type,
      cabinet_title: cabinetInfo.title,
      max_user: cabinetInfo.max_user,
      activation: cabinetInfo.activation,
    };
    if (cabinetInfo.activation === 3) {
      // FIXME: lent_info는 대여중일 때만 추가되나요..? 공유사물함 인원이 다 차지 않은 경우에는 lent_info를 안보여주는게 맞는지 의문입니다.
      cabinetInfoDto.lent_info = await this.getLentUsers(cabinet_id);
    }
    console.log(cabinetInfoDto);
    return cabinetInfoDto;
  }

  async getLentUsers(cabinet_id: number): Promise<LentDto[]> {
    const lentDto: Array<LentDto> = [];
    const lentInfo = await this.cabinetInfoRepository.findOne({
      relations: ['lent', 'lent.user'],
      where: {
        cabinet_id,
        lent: {
          cabinet: true,
        },
      },
    });

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

  async updateCabinetActivation(
    cabinet_id: number,
    activation: number,
  ): Promise<void> {
    const cabinet = await this.cabinetInfoRepository.findOne({
      where: {
        cabinet_id,
      },
    });
    cabinet.activation = activation;
    await this.cabinetInfoRepository.save(cabinet);
  }
}
