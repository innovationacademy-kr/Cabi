import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CabinetDto } from "src/dto/cabinet.dto";
import { CabinetInfoResponseDto } from "src/dto/response/cabinet.info.response.dto";
import { MyCabinetInfoResponseDto } from "src/dto/response/my.cabinet.info.response.dto";
import { UserSessionDto } from "src/dto/user.session.dto";
import LentType from "src/enums/lent.type.enum";
import { CabinetInfoService } from "../cabinet/cabinet.info.service";
import { ILentRepository } from "./repository/lent.repository.interface";

@Injectable()
export class LentService {
  constructor(
    private lentRepository: ILentRepository,
    private cabinetInfoService: CabinetInfoService,
    ) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 해당 유저가 대여중인 사물함이 있는지 확인
    // TODO: Repository 함수 구현 필요.
    const is_lent: boolean = await this.lentRepository.getIsLent(user.user_id);
    console.log(is_lent);
    if (is_lent) {
      throw new HttpException(`${user.intra_id} already lent cabinet!`, HttpStatus.BAD_REQUEST);
    }

    // TODO: Repository 함수 구현 필요.
    let cabinet: CabinetInfoResponseDto = await this.cabinetInfoService.getCabinetInfo(cabinet_id);
    console.log(cabinet);
    // 2. 사용 가능한 사물함인지 확인
    if (cabinet.activation !== 1) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is unavailable!`, HttpStatus.FORBIDDEN);
    }

    // 3. 동아리 사물함인지 확인
    if (cabinet.lent_type === LentType.CIRCLE) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is circle cabinet!`, HttpStatus.I_AM_A_TEAPOT);
    }

    const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(cabinet_id);
    console.log(lent_user_cnt);
    // 4. 잔여 자리가 있는지 확인
    if (lent_user_cnt === cabinet.max_user) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is full!`, HttpStatus.CONFLICT);
    }

    // 대여가 가능하므로 대여 시도
    // 1. lent table에 insert
    await this.lentRepository.lentCabinet(user, cabinet);

    // 2. 현재 대여로 인해 Cabinet이 풀방이 되면 Cabinet의 activation을 3으로 수정.
    if (lent_user_cnt + 1 === cabinet.max_user) {
      await this.cabinetInfoService.updateCabinetActivation(cabinet_id, 3); // TODO: Cabinet Repository에서 Cabinet Activation을 변경하는 함수가 필요합니다.
    }
    let response: MyCabinetInfoResponseDto;
    return response;
  }
}
