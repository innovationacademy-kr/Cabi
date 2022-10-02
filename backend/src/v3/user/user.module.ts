import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/entities/user.entity';
import { BanModule } from '../ban/ban.module';
import { MyInfoController } from './my.info.controller';
import { MyLentInfoController } from './my.lent.info.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

const repo = {
  provide: 'IUserRepository',
  useClass: UserRepository,
};

@Module({
  imports: [
    AuthModule,
    forwardRef(() => BanModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [MyLentInfoController, MyInfoController],
  providers: [UserService, repo],
  exports: [UserService],
})
export class UserModule {}
