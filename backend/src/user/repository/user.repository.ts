import { InjectRepository } from '@nestjs/typeorm';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { CabinetExtendDto } from 'src/dto/cabinet.extend.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import User from 'src/entities/user.entity';
import UserStateType from 'src/enums/user.state.type.enum';
import { Repository } from 'typeorm';
import { IsolationLevel, Propagation, Transactional } from 'typeorm-transactional';
import { IUserRepository } from './user.repository.interface';

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // NOTE: lent_info 안에 현재 user(user_id)만 나오는 문제가 있어 함수를 수정합니다.
  async getCabinetByUserId(userId: number): Promise<CabinetExtendDto | null> {
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
    let cabinet_memo = result.Lent.cabinet.memo;
    if (cabinet_memo !== null) {
      cabinet_memo = Buffer.from(cabinet_memo, 'base64').toString('utf8');
    }
    return {
      location: result.Lent.cabinet.location,
      floor: result.Lent.cabinet.floor,
      section: result.Lent.cabinet.section,
      cabinet_id: result.Lent.cabinet.cabinet_id,
      cabinet_num: result.Lent.cabinet.cabinet_num,
      lent_type: result.Lent.cabinet.lent_type,
      cabinet_title: result.Lent.cabinet.title,
      cabinet_memo: cabinet_memo,
      max_user: result.Lent.cabinet.max_user,
      status: result.Lent.cabinet.status,
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

  async updateUserState(user_id: number, state: UserStateType): Promise<void> {
    await this.userRepository
      .createQueryBuilder(this.updateUserState.name)
      .update(User)
      .set({
        state: state,
      })
      .where('user_id = :user_id', { user_id: user_id })
      .execute();
  }

  async getAllUser(): Promise<UserSessionDto[]> {
    const result = await this.userRepository.find();
    return result.map((user) => {
      return {
        user_id: user.user_id,
        intra_id: user.intra_id,
        blackholed_at: user.blackhole_date,
      };
    });
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async getCabinetDtoByUserId(user_id: number): Promise<CabinetDto | null> {
    const result = await this.userRepository.findOne({
      relations: {
        Lent: {
          cabinet: true,
        },
      },
      where: {
        user_id: user_id,
      },
    });
    if (result === null || result.Lent === null) {
      return null;
    }
    return {
      cabinet_id: result.Lent.cabinet.cabinet_id,
      cabinet_num: result.Lent.cabinet.cabinet_num,
      lent_type: result.Lent.cabinet.lent_type,
      cabinet_title: result.Lent.cabinet.title,
      max_user: result.Lent.cabinet.max_user,
      status: result.Lent.cabinet.status,
      section: result.Lent.cabinet.section,
    };
  }

  @Transactional({
    propagation: Propagation.REQUIRED,
    isolationLevel: IsolationLevel.SERIALIZABLE,
  })
  async deleteUserById(user_id: number): Promise<void> {
    await this.userRepository
      .createQueryBuilder(this.deleteUserById.name)
      .delete()
      .where({
        user_id: user_id,
      })
      .execute();
  }

  async updateBlackholeDate(
    user_id: number,
    blackhole_date: Date,
  ): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        blackhole_date: blackhole_date,
      })
      .where({
        user_id: user_id,
      })
      .execute();
  }
}
