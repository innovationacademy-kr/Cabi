import { InjectRepository } from '@nestjs/typeorm';
import { IAdminSearchRepository } from './search.repository.interface';
import Cabinet from 'src/entities/cabinet.entity';
import BanLog from 'src/entities/ban.log.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import User from 'src/entities/user.entity';
import { UserInfoPagenationDto } from 'src/admin/dto/user.info.pagenation.dto';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoPagenationDto } from 'src/admin/dto/cabinet.info.pagenation.dto';
import CabinetStatusType from 'src/enums/cabinet.status.type.enum';
import { BrokenCabinetInfoPagenationDto } from 'src/admin/dto/broken.cabinet.info.pagenation.dto';
import { BlockedUserInfoPagenationDto } from 'src/admin/dto/blocked.user.info.pagenation.dto';
import { UserCabinetInfoPagenationDto } from 'src/admin/dto/user.cabinet.info.pagenation.dto';
import { AdminStatisticsDto } from 'src/admin/dto/admin.statstics.dto';
import Lent from 'src/entities/lent.entity';
import LentLog from 'src/entities/lent.log.entity';

export class AdminSearchRepository implements IAdminSearchRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Cabinet) private cabinetRepository: Repository<Cabinet>,
	@InjectRepository(Lent) private lentRepository: Repository<Lent>,
	@InjectRepository(LentLog) private lentLogRepository: Repository<LentLog>,
    @InjectRepository(BanLog) private banLogRepository: Repository<BanLog>,
  ) {}

  async searchByIntraId(
    intraId: string,
    page: number,
    length: number,
  ): Promise<UserInfoPagenationDto> {
    const result = await this.userRepository.findAndCount({
      select: {
        user_id: true,
        intra_id: true,
      },
      where: {
        intra_id: Like(`%${intraId}%`),
      },
      order: { user_id: 'ASC' },
      take: length,
      skip: page * length,
    });
    const rtn = {
      result: result[0].map((r) => ({
        user_id: r.user_id,
        intra_id: r.intra_id,
      })),
      total_length: result[1],
    };
    return rtn;
  }

  async searchUserCabinetListByIntraId(
    intraId: string,
    page: number,
    length: number,
  ): Promise<UserCabinetInfoPagenationDto> {
    // intraId를 포함하는 유저들을 찾아서 해당 유저가 대여중인 사물함 정보와 해당 사물함을
    // 대여중인 유저들의 정보를 반환
    const result = await this.userRepository.findAndCount({
      relations: [
        'Lent',
        'Lent.cabinet',
        'Lent.cabinet.lent',
        'Lent.cabinet.lent.user',
      ],
      where: {
        intra_id: Like(`%${intraId}%`),
      },
      // Lent가 null이 아닌 값들은 Lent.cabinet.floor, Lent.cabinet.cabinet_num로 오름차순 정렬
      // Lent가 null인 값들은 intra_id로 오름차순 정렬
      order: {
        Lent: {
          cabinet: {
            floor: 'ASC',
            cabinet_num: 'ASC',
          },
        },
        intra_id: 'ASC',
      },
    });

    const rtn = {
      result: result[0].map(
        (user) =>
          user && {
            user_id: user.user_id,
            intra_id: user.intra_id,
            cabinetInfo: user.Lent &&
              user.Lent.cabinet && {
                cabinet_id: user.Lent.cabinet.cabinet_id,
                cabinet_num: user.Lent.cabinet.cabinet_num,
                lent_type: user.Lent.cabinet.lent_type,
                cabinet_title: user.Lent.cabinet.title,
                max_user: user.Lent.cabinet.max_user,
                status: user.Lent.cabinet.status,
                section: user.Lent.cabinet.section,
                location: user.Lent.cabinet.location,
                floor: user.Lent.cabinet.floor,
                status_note: user.Lent.cabinet.status_note,
              },
          },
      ),
      total_length: result[1],
    };
    // rtn에서 cabinetInfo가 null인 값들을 배열의 끝으로 보낸다.
    rtn.result.sort((a, b) => {
      if (a.cabinetInfo === null && b.cabinetInfo !== null) {
        return 1;
      } else if (a.cabinetInfo !== null && b.cabinetInfo === null) {
        return -1;
      } else {
        return 0;
      }
    });
    // take length, skip page * length
    rtn.result = rtn.result.slice(page * length, (page + 1) * length);
    return rtn;
  }

  async searchByLentType(
    lentType: LentType,
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto> {
    const result = await this.cabinetRepository.findAndCount({
      relations: ['lent', 'lent.user'],
      where: {
        lent_type: lentType,
      },
      order: { cabinet_id: 'ASC' },
      take: length,
      skip: page * length,
    });
    const rtn = {
      result: result[0].map((cabinet) => ({
        cabinet_id: cabinet.cabinet_id,
        cabinet_num: cabinet.cabinet_num,
        lent_type: cabinet.lent_type,
        cabinet_title: cabinet.title,
        max_user: cabinet.max_user,
        status: cabinet.status,
        location: cabinet.location,
        floor: cabinet.floor,
        section: cabinet.section,
        lent_info: cabinet.lent.map((lent) => ({
          user_id: lent.user.user_id,
          intra_id: lent.user.intra_id,
          lent_id: lent.lent_id,
          lent_time: lent.lent_time,
          expire_time: lent.expire_time,
        })),
      })),
      total_length: result[1],
    };
    return rtn;
  }

  async searchByCabinetNumber(
    visibleNum: number,
    floor?: number,
  ): Promise<CabinetInfoPagenationDto> {
    const result = await this.cabinetRepository.find({
      relations: ['lent', 'lent.user'],
      where: {
        cabinet_num: visibleNum,
        floor: floor,
      },
      order: { cabinet_id: 'ASC' },
    });
    const rtn = {
      result: result.map((cabinet) => ({
        cabinet_id: cabinet.cabinet_id,
        cabinet_num: cabinet.cabinet_num,
        lent_type: cabinet.lent_type,
        cabinet_title: cabinet.title,
        max_user: cabinet.max_user,
        status: cabinet.status,
        location: cabinet.location,
        floor: cabinet.floor,
        section: cabinet.section,
        lent_info: cabinet.lent.map((lent) => ({
          user_id: lent.user.user_id,
          intra_id: lent.user.intra_id,
          lent_id: lent.lent_id,
          lent_time: lent.lent_time,
          expire_time: lent.expire_time,
        })),
      })),
      total_length: result.length,
    };
    return rtn;
  }

  async searchByBannedCabinet(
    page: number,
    length: number,
  ): Promise<CabinetInfoPagenationDto> {
    const result = await this.cabinetRepository.findAndCount({
      relations: ['lent', 'lent.user'],
      where: {
        status: CabinetStatusType.BANNED,
      },
      order: { cabinet_id: 'ASC' },
      take: length,
      skip: page * length,
    });
    const rtn = {
      result: result[0].map((cabinet) => ({
        cabinet_id: cabinet.cabinet_id,
        cabinet_num: cabinet.cabinet_num,
        lent_type: cabinet.lent_type,
        cabinet_title: cabinet.title,
        max_user: cabinet.max_user,
        status: cabinet.status,
        location: cabinet.location,
        floor: cabinet.floor,
        section: cabinet.section,
        lent_info: cabinet.lent.map((lent) => ({
          user_id: lent.user.user_id,
          intra_id: lent.user.intra_id,
          lent_id: lent.lent_id,
          lent_time: lent.lent_time,
          expire_time: lent.expire_time,
        })),
      })),
      total_length: result[1],
    };
    return rtn;
  }

  async searchByBrokenCabinet(
    page: number,
    length: number,
  ): Promise<BrokenCabinetInfoPagenationDto> {
    const result = await this.cabinetRepository.findAndCount({
      where: {
        status: CabinetStatusType.BROKEN,
      },
      order: { cabinet_id: 'ASC' },
      take: length,
      skip: page * length,
    });
    const rtn = {
      result: result[0].map((cabinet) => ({
        cabinet_id: cabinet.cabinet_id,
        cabinet_num: cabinet.cabinet_num,
        lent_type: cabinet.lent_type,
        note: cabinet.title,
        max_user: cabinet.max_user,
        section: cabinet.section,
      })),
      total_length: result[1],
    };
    return rtn;
  }

  async searchByBanUser(
    page: number,
    length: number,
  ): Promise<BlockedUserInfoPagenationDto> {
    const result = await this.banLogRepository.findAndCount({
      relations: ['user'],
      where: {
        unbanned_date: MoreThan(new Date()),
      },
      order: { ban_log_id: 'ASC' },
      take: length,
      skip: page * length,
    });
    const rtn = {
      result: result[0].map((ban) => ({
        user_id: ban.ban_user_id,
        intra_id: ban.user.intra_id,
        banned_date: ban.banned_date,
        unbanned_date: ban.unbanned_date,
      })),
      total_length: result[1],
    };
    return rtn;
  }

  async getLentReturnStatisticsByDateFromNow(
	date: number,
  ): Promise<AdminStatisticsDto> {
	const startDate: Date = new Date();
	const endDate: Date = new Date(-24 * 3600 * 7 * 1000);
	const lentQuery = await this.lentRepository
	.createQueryBuilder('dateLent')
	.where('dateLent.lent_time >= : startDateLent', { startDate })
	.andWhere('dateLent.lent_time <= : endDate', { endDate });
	const lentCount = await lentQuery.getCount();

	const returnQuery = await this.lentLogRepository
	.createQueryBuilder('dateReturn')
	.where('dateReturn.return_time >= : startDateLent', { startDate })
	.andWhere('dateReturn.return_time <= : endDate', { endDate });
	const returnCount = await returnQuery.getCount();

	const ret = {
		daysFromNow: date,
		lentCount: lentCount,
		returnCount: returnCount,
	};
	return (ret);
  }
}
