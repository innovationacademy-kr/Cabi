import { LentCabinetInfoDto } from 'src/cabinet/dto/cabinet.lent.info.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserSessionDto } from '../dto/user.session.dto';

export abstract class IAuthRepository {
  abstract checkUser(user: UserSessionDto): Promise<LentCabinetInfoDto>;
  abstract addUser(user: UserSessionDto): Promise<void>;
  abstract updateUser(user: UserSessionDto): Promise<void>;
  abstract getUser(user: UserSessionDto): Promise<LentCabinetInfoDto>;
  abstract getAllUser(): Promise<UserDto[]>;
}
