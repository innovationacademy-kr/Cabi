import { InjectRepository } from '@nestjs/typeorm';
import { CabinetExtendDto } from 'src/dto/cabinet.extend.dto';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entities/user.entity';
import UserStateType from 'src/enums/user.state.type.enum';
import { Repository } from 'typeorm';
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
    console.log(result);
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

  async getMinUserId(): Promise<number> {
    const result = await this.userRepository
      .createQueryBuilder(this.getMinUserId.name)
      .select('user_id')
      .orderBy('user_id', 'ASC')
      .limit(1)
      .getRawOne();
    return result ? result.user_id : -1;
  }

  async updateUserInfo(user_id: number, new_user: UserDto): Promise<void> {
    await this.userRepository
      .createQueryBuilder(this.updateUserInfo.name)
      .update(User)
      .set({
        user_id: new_user.user_id,
        intra_id: new_user.intra_id,
      })
      .where('user_id = :user_id', { user_id: user_id })
      .execute();
  }

  async getAllUser(): Promise<UserDto[]> {
    const result = await this.userRepository.find();
    return result.map((user) => {
      return {
        user_id: user.user_id,
        intra_id: user.intra_id,
      };
    });
  }

  async deleteUser(user: UserDto): Promise<void> {
    await this.userRepository
      .createQueryBuilder(this.deleteUser.name)
      .delete()
      .where({
        user_id: user.user_id,
      })
      .execute();
  }
}
