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
    return;
  }

  async getCabinetInfo(cabinet_id: number): Promise<CabinetInfoResponseDto> {
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
      cabinetInfoDto.lent_info = await this.getLentUsers(cabinet_id);
    }
    return cabinetInfoDto;
  }

  async getLentUsers(cabinet_id: number): Promise<LentDto[]> {
    let lentDto: Array<LentDto>;
    const lentInfo = await this.cabinetInfoRepository.findOne({
      relations: {
        lent: true,
      },
      where: {
        cabinet_id,
        lent: {
          lent_cabinet_id: true,
        },
      },
    });
    lentInfo.lent.forEach((lent) =>
      lentDto.push({
        user_id: lent.lent_user_id.user_id,
        intra_id: lent.lent_user_id.intra_id,
        lent_id: lent.lent_id,
        lent_time: lent.lent_time,
        expire_time: lent.expire_time,
        is_expired: false,
      }),
    );
    return lentDto;
  }
}
