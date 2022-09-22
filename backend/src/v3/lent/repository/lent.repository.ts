import { InjectRepository } from "@nestjs/typeorm";
import { CabinetDto } from "src/dto/cabinet.dto";
import { UserSessionDto } from "src/dto/user.session.dto";
import Lent from "src/entities/lent.entity";
import LentType from "src/enums/lent.type.enum";
import { Repository } from "typeorm";
import { ILentRepository } from "./lent.repository.interface";

export class lentRepository implements ILentRepository {
  constructor(
    @InjectRepository(Lent)
    private lentRepository: Repository<Lent>,
  ) {}

  async getIsLent(user_id: number): Promise<boolean> {
    const result = await this.lentRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        user: {
          user_id: user_id,
        },
      },
    });
    if (!result) {
      return false;
    }
    return true;
  }

  async getLentUserCnt(cabinet_id: number): Promise<number> {
    const result: number = await this.lentRepository.count({
      relations: {
        cabinet: true,
      },
      where: {
        cabinet: {
          cabinet_id: cabinet_id,
        }
      },
    });
    return result;
  }

  async lentCabinet(user: UserSessionDto, cabinet: CabinetDto): Promise<void> {
    const lent_time = new Date();
    let expire_time = new Date();
    if (cabinet.lent_type === LentType.PRIVATE) {
      expire_time.setDate(lent_time.getDate() + 30);
    } else {
      expire_time.setDate(lent_time.getDate() + 45);
    }
    await this.lentRepository.insert({
      user: {
        user_id: user.user_id,
      },
      cabinet: {
        cabinet_id: cabinet.cabinet_id,
      },
      lent_time,
      expire_time,
    });
  }

  async getLentCabinetId(user_id: number): Promise<number> {
    const result = await this.lentRepository.findOne({
      relations: {
        user: true,
        cabinet: true,
      },
      select: {
        cabinet: {
          cabinet_id: true,
        }
      },
      where: {
        user: {
          user_id: user_id,
        }
      },
    });
    return result.lent_cabinet_id;
  }

  async updateLentCabinetTitle(cabinet_title: string, cabinet_id: number): Promise<void> {
    await this.lentRepository.createQueryBuilder()
    .update('cabinet')
    .set({
        title: cabinet_title
    })
    .where({
        cabinet_id: cabinet_id,
    })
    .execute();
  }

  async updateLentCabinetMemo(cabinet_memo: string, cabinet_id: number): Promise<void> {
    await this.lentRepository.createQueryBuilder()
    .update('cabinet')
    .set({
        memo: cabinet_memo
    })
    .where({
        cabinet_id: cabinet_id,
    })
    .execute();
  }
}
