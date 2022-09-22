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
    // private userService: UserService,
    ) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 해당 유저가 대여중인 사물함이 있는지 확인
    const is_lent: boolean = await this.lentRepository.getIsLent(user.user_id);
    console.log(is_lent);
    if (is_lent) {
      throw new HttpException(`${user.intra_id} already lent cabinet!`, HttpStatus.BAD_REQUEST);
    }

    // 2. 고장이나 ban 사물함인지 확인
    const cabinet: CabinetInfoResponseDto = await this.cabinetInfoService.getCabinetInfo(cabinet_id); // TODO: CabinetDto만 받아오는 내부적으로만 사용되는 Repository function 필요.
    console.log(cabinet);
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
    await this.lentRepository.lentCabinet(user, cabinet);

    // 2. 현재 대여로 인해 Cabinet이 풀방이 되면 Cabinet의 activation을 3으로 수정.
    const lent_user_cnt: number = await this.lentRepository.getLentUserCnt(cabinet_id);
    console.log(lent_user_cnt);
    // if (lent_user_cnt === cabinet.max_user) {
      // await this.cabinetInfoService.updateCabinetActivation(cabinet_id, 3); // TODO: Cabinet Repository에서 Cabinet Activation을 변경하는 함수가 필요합니다.
    // }
    const response: MyCabinetInfoResponseDto = undefined;
    // const response: MyCabinetInfoResponseDto = await this.UserService.getMyLentInfo(user); // TODO: User 모듈에서 구현 필요.
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
    // TODO: 구현 필요.
  }
}
