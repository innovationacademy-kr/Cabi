import { UserDto } from 'src/user/dto/user.dto';

export abstract class IEmailRepository {
  abstract getAllUser(): Promise<UserDto[]>;
}
