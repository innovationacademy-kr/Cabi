import { lentCabinetInfoDto } from 'src/cabinet/dto/cabinet-lent-info.dto';
import { UserSessionDto } from '../dto/user.session.dto';

export abstract class IAuthRepository {
  abstract checkUser(user: UserSessionDto): Promise<lentCabinetInfoDto>;
  abstract addUser(user: UserSessionDto): Promise<void>;
  abstract updateUser(user: UserSessionDto): Promise<void>;
  abstract getUser(user: UserSessionDto): Promise<lentCabinetInfoDto>;
}
