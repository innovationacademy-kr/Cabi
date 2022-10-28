import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entities/user.entity';
import UserStateType from 'src/enums/user.state.type.enum';
import { Repository } from 'typeorm';
import { IAuthRepository } from './auth.repository.interface';

export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async addUserIfNotExists(
    user: UserDto,
    blackhole_date?: Date,
  ): Promise<boolean> {
    const find = await this.userRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (!find) {
      await this.userRepository.save({
        user_id: user.user_id,
        intra_id: user.intra_id,
        state: UserStateType.NORMAL,
        email: user.email,
        first_login: new Date(),
        last_login: new Date(),
        blackhole_date: blackhole_date,
      });
      return false;
    }
    return true;
  }

  async checkUserBorrowed(user: UserDto): Promise<boolean> {
    const result = await this.userRepository.findOne({
      relations: {
        Lent: true,
      },
      where: {
        user_id: user.user_id,
      },
    });
    return result.Lent !== null;
  }

  async checkUserExists(user_id: number): Promise<boolean> {
    const result = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.user_id'])
      .where('u.user_id = :user_id', { user_id })
      .execute();
    return result.length !== 0;
  }
}
