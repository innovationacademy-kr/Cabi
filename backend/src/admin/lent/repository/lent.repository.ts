import { InjectRepository } from "@nestjs/typeorm";
import { LentInfoDto } from "src/admin/dto/lent.info.dto";
import { OverdueInfoDto } from "src/admin/dto/overdue-info.dto";
import { IAdminLentRepository } from "src/admin/lent/repository/lent.repository.interface";
import Lent from "src/entities/lent.entity";
import CabinetStatusType from "src/enums/cabinet.status.type.enum";
import { Repository } from "typeorm";


export class AdminLentRepository implements IAdminLentRepository {
  constructor(
    @InjectRepository(Lent)
    private adminLentRepository: Repository<Lent>,
  ) {}

  async getLentInfo(): Promise<LentInfoDto[]> {
    const lockerRentalUser = await this.adminLentRepository.find({
      relations: {
        user: true,
      },
      select: {
        user: {
          intra_id: true,
        },
        lent_id: true,
        lent_cabinet_id: true,
        lent_user_id: true,
        lent_time: true,
        expire_time: true,
      },
    });

    const lentInfo: LentInfoDto[] = [];
    for (let i = 0; i < lockerRentalUser.length; i += 1) {
      lentInfo.push({
        lent_id: lockerRentalUser[i].lent_id,
        lent_cabinet_id: lockerRentalUser[i].lent_cabinet_id,
        lent_user_id: lockerRentalUser[i].lent_user_id,
        lent_time: lockerRentalUser[i].lent_time,
        expire_time: lockerRentalUser[i].expire_time,
        extension: undefined,
        intra_id: lockerRentalUser[i].user.intra_id,
      });
    }
    return lentInfo;
  }

  async getLentOverdue(): Promise<OverdueInfoDto[]> {
    const results = await this.adminLentRepository.find({
      relations: {
        user: true,
        cabinet: true,
      },
      select: {
        user: {
          intra_id: true,
        },
        cabinet: {
          floor: true,
          cabinet_num: true,
        },
        lent_time: true,
        expire_time: true,
      },
      where: {
        cabinet: {
          status: CabinetStatusType.EXPIRED,
        },
      },
      order: {
        expire_time: 'ASC',
      },
    });

    return results.map((result) => ({
      intra_id: result.user.intra_id,
      floor: result.cabinet.floor,
      cabinet_num: result.cabinet.cabinet_num,
      lent_time: result.lent_time,
      expire_time: result.expire_time,
    }));
  }
}
