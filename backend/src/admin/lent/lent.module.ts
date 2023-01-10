import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLentService } from 'src/admin/lent/lent.service';
import { LentRepository } from 'src/admin/lent/repository/lent.repository';
import { AuthModule } from 'src/auth/auth.module';
import Lent from 'src/entities/lent.entity';
import { LentModule } from 'src/lent/lent.module';
import { LentController } from './lent.controller';

const repo = {
  provide: 'ILentRepository',
  useClass: LentRepository,
}
@Module({
  controllers: [LentController],
  providers: [repo, AdminLentService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Lent]),
    LentModule],
  exports: []
})
export class AdminLentModule {}
