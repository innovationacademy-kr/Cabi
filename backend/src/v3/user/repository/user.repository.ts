import { InjectRepository } from '@nestjs/typeorm';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import User from 'src/entities/user.entity';
import UserStateType from 'src/enums/user.state.type.enum';
import { QueryRunner, Repository } from 'typeorm';
import { IUserRepository } from './user.repository.interface';

export class UserRepository implements IUserRepository {
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
    if (result === null || result.Lent === null) {
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
      status: result.Lent.cabinet.status,
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

  async checkUserBorrowed(userId: number): Promise<number> {
    const result = await this.userRepository.findOne({
      relations: {
        Lent: true,
      },
      where: {
        user_id: userId,
      },
    });
    return result && result.Lent ? result.Lent.lent_cabinet_id : -1;
  }

  async updateUserState(user_id: number, state: UserStateType, queryRunner?: QueryRunner): Promise<void> {
    await this.userRepository.createQueryBuilder(this.updateUserState.name, queryRunner)
    .update(User)
    .set({
      state: state,
    })
    .where('user_id = :user_id', { user_id: user_id })
    .execute();
  }
}
