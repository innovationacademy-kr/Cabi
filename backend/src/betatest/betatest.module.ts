import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BanLog from 'src/entities/ban.log.entity';
import { UserModule } from 'src/user/user.module';
import { BetatestController } from './betatest.controller';
import { BetatestService } from './betatest.service';
import { BetatestRepository } from './repository/betatest.repository';

const repo = {
  provide: 'IBetatestRepository',
  useClass: BetatestRepository,
};

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([BanLog])],
  providers: [BetatestService, repo],
  controllers: [BetatestController],
})
export class BetatestModule {}
