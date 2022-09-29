import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/entities/user.entity';
import { MyInfoController } from './my.info.controller';
import { MyLentInfoController } from './my.lent.info.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

const repo = {
  provide: 'IUserRepository',
  useClass: UserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [MyLentInfoController, MyInfoController],
  providers: [UserService, repo],
})
export class UserModule {}
