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
    let cabinet: CabinetInfoResponseDto = await this.cabinetInfoService.getCabinetInfo(cabinet_id); // TODO: Lent Module에서 Cabinet Module을 import하고, Cabinet Module에서 service를 provider로 등록 필요.
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

    // // 대여가 가능하므로 대여 시도
    // // 1. lent table에 insert
    await this.lentRepository.lentCabinet(user, cabinet);
    let response: MyCabinetInfoResponseDto;
    return response;
  }
}
