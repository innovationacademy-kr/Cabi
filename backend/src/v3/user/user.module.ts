import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MyLentInfoController } from './my.lent.info.controller';

@Module({
  imports: [AuthModule],
  controllers: [MyLentInfoController],
})
export class UserModule {}
