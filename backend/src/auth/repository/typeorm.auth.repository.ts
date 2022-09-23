import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IAuthRepository } from './auth.repository.interface';

export class TypeormAuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async addUserIfNotExists(user: UserDto): Promise<boolean> {
    const find = await this.userRepository.findOne({
      where: {
        user_id: user.user_id,
      },
    });
    if (!find) {
      await this.userRepository.save({
        user_id: user.user_id,
        intra_id: user.intra_id,
        auth: 0,
        email: user.email,
        phone: '',
        first_login: new Date(),
        last_login: new Date(),
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
}
