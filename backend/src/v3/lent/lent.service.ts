import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CabinetDto } from 'src/dto/cabinet.dto';
import { CabinetInfoResponseDto } from 'src/dto/response/cabinet.info.response.dto';
import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';
import { UserSessionDto } from 'src/dto/user.session.dto';
import Lent from 'src/entities/lent.entity';
import LentType from 'src/enums/lent.type.enum';
import { CabinetInfoService } from '../cabinet/cabinet.info.service';
import { UserService } from '../user/user.service';
import { ILentRepository } from './repository/lent.repository.interface';

@Injectable()
export class LentService {
  constructor(
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    private userService: UserService,
    ) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 해당 유저가 대여중인 사물함이 있는지 확인
    const is_lent: boolean = await this.lentRepository.getIsLent(user.user_id);
    if (is_lent) {
      throw new HttpException(
        `${user.intra_id} already lent cabinet!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. 고장이나 ban 사물함인지 확인
    const cabinet: CabinetInfoResponseDto = await this.cabinetInfoService.getCabinetResponseInfo(cabinet_id);
    if (cabinet.activation === 0 || cabinet.activation === 2) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is unavailable!`, HttpStatus.FORBIDDEN);
    }

    // 3. 잔여 자리가 있는지 확인
    if (cabinet.activation === 3) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is full!`, HttpStatus.CONFLICT);
    }

    // 4. 동아리 사물함인지 확인
    if (cabinet.lent_type === LentType.CIRCLE) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is circle cabinet!`, HttpStatus.I_AM_A_TEAPOT);
    }

    // 대여가 가능하므로 대여 시도
    // 1. lent table에 insert
    const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(cabinet_id);
    const is_generate_expire_time: boolean = (lent_user_cnt + 1 === cabinet.max_user) ? true : false;
    await this.lentRepository.lentCabinet(user, cabinet, is_generate_expire_time);

    // 2. 현재 대여로 인해 Cabinet이 풀방이 되어 만료 기한이 생기면 Cabinet의 activation을 3으로 수정.
    if (is_generate_expire_time) {
      await this.cabinetInfoService.updateCabinetActivation(cabinet_id, 3);
    }
    const response: MyCabinetInfoResponseDto = await this.userService.getCabinetByUserId(user.user_id);
    return response;
  }

  async updateLentCabinetTitle(cabinet_title: string, user: UserSessionDto): Promise<void> {
    // 1. 해당 유저가 대여중인 사물함 id를 가져옴.
    const my_cabinet_id: number = await this.lentRepository.getLentCabinetId(user.user_id);
    if (my_cabinet_id === null) {
      throw new HttpException(`${user.intra_id} doesn't lent cabinet!`, HttpStatus.BAD_REQUEST);
    }
    // 2. 해당 캐비넷 제목 업데이트
    await this.lentRepository.updateLentCabinetTitle(cabinet_title, my_cabinet_id);
  }

  async updateLentCabinetMemo(cabinet_memo: string, user: UserSessionDto): Promise<void> {
    // 1. 해당 유저가 대여중인 사물함 id를 가져옴.
    const my_cabinet_id: number = await this.lentRepository.getLentCabinetId(user.user_id);
    if (my_cabinet_id === null) {
      throw new HttpException(`${user.intra_id} doesn't lent cabinet!`, HttpStatus.BAD_REQUEST);
    }
    // 2. 해당 캐비넷 메모 업데이트
    await this.lentRepository.updateLentCabinetMemo(cabinet_memo, my_cabinet_id);
  }

  async returnLentCabinet(user: UserSessionDto): Promise<void> {
    // 1. 해당 유저가 대여중인 lent 정보를 가져옴.
    const lent: Lent = await this.lentRepository.getLent(user.user_id);
    if (lent === null) {
      throw new HttpException(`${user.intra_id} doesn't lent cabinet!`, HttpStatus.BAD_REQUEST);
    }
    // 2. Lent Table에서 값 제거.
    await this.lentRepository.deleteLentByLentId(lent.lent_id);
    // 3. Lent Log Table에서 값 추가.
    await this.lentRepository.addLentLog(lent);
    // 4. 개인 사물함인 경우 Cabinet Status 사용 가능으로 수정.
    if (lent.cabinet.lent_type === LentType.PRIVATE) {
      await this.cabinetInfoService.updateCabinetActivation(lent.lent_cabinet_id, 1);
    }
    // 5. 공유 사물함인 경우 전체 인원 모두 중도 이탈했다면 Cabinet Status 사용 가능으로 수정.
    if (lent.cabinet.lent_type === LentType.SHARE) {
      const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(lent.cabinet.cabinet_id);
      if (lent_user_cnt === 0) {
        await this.cabinetInfoService.updateCabinetActivation(lent.lent_cabinet_id, 1);
      }
    }
  }
}
