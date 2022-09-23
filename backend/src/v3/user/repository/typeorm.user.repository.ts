import { InjectRepository } from '@nestjs/typeorm';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IUserRepository } from './user.repository';

export class TypeormUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getCabinetByUserId(
    userId: number,
  ): Promise<MyCabinetInfoResponseDto | null> {
    const result = await this.userRepository.findOne({
      relations: {
        Lent: {
          cabinet: true,
        },
      },
      where: {
        user_id: userId,
      },
    });
    if (result.Lent === null) {
      return null;
    }
    return {
      location: result.Lent.cabinet.location,
      floor: result.Lent.cabinet.floor,
      section: result.Lent.cabinet.section,
      cabinet_id: result.Lent.cabinet.cabinet_id,
      cabinet_num: result.Lent.cabinet.cabinet_num,
      lent_type: result.Lent.cabinet.lent_type,
      cabinet_title: result.Lent.cabinet.title,
      cabinet_memo: result.Lent.cabinet.memo,
      max_user: result.Lent.cabinet.max_user,
      activation: result.Lent.cabinet.activation,
      lent_info: [
        {
          user_id: result.user_id,
          intra_id: result.intra_id,
          lent_id: result.Lent.lent_id,
          lent_time: result.Lent.lent_time,
          expire_time: result.Lent.expire_time,
          is_expired: result.Lent.expire_time < new Date(),
        },
      ],
    };
  }
}
