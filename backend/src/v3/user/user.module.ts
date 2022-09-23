import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/entities/user.entity';
import { MyLentInfoController } from './my.lent.info.controller';
import { TypeormUserRepository } from './repository/typeorm.user.repository';
import { UserService } from './user.service';

const repo = {
  provide: 'IUserRepository',
  useClass: TypeormUserRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [MyLentInfoController],
  providers: [UserService, repo],
})
export class UserModule {}
