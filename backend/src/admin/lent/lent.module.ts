import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLentService } from 'src/admin/lent/lent.service';
import { AdminLentRepository } from 'src/admin/lent/repository/lent.repository';
import { AuthModule } from 'src/auth/auth.module';
import Lent from 'src/entities/lent.entity';
import { LentModule } from 'src/lent/lent.module';
import { AdminLentController } from './lent.controller';

const adminLentRepo = {
  provide: 'IAdminLentRepository',
  useClass: AdminLentRepository,
}
@Module({
  controllers: [AdminLentController],
  providers: [adminLentRepo, AdminLentService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Lent]),
    LentModule,
    ],
  exports: []
})
export class AdminLentModule {}
