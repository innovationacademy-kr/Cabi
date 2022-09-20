import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CabinetDto } from "src/dto/cabinet.dto";
import { MyCabinetInfoResponseDto } from "src/dto/response/my.cabinet.info.response.dto";
import { UserSessionDto } from "src/dto/user.session.dto";
import LentType from "src/enums/lent.type.enum";

@Injectable()
export class LentService {
  constructor(
    private lentRepository: ILentRepository,
    private cabinetRepository: ICabinetRepository,
    ) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 해당 유저가 대여중인 사물함이 있는지 확인
    if (user.is_lent) { // TODO: UserSessionDto에 is_lent 필드가 필요합니다.
      throw new HttpException(`${user.intra_id} already lent cabinet!`, HttpStatus.BAD_REQUEST);
    }

    // TODO: Repository 함수 구현 필요.
    let cabinet: MyCabinetInfoResponseDto = await this.cabinetRepository.getCabinetInfo(cabinet_id); // TODO: Lent Module에서 Cabinet Module을 import하고, Cabinet Module에서 repo를 provider로 등록 필요.

    // 2. 사용 가능한 사물함인지 확인
    if (cabinet.activation !== 1) { // TODO: CabinetDto나 CabinetExtendDto에 activation 필드 추가 필요합니다.
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is unavailable!`, HttpStatus.FORBIDDEN);
    }

    // 3. 동아리 사물함인지 확인
    if (cabinet.lent_type === LentType.CIRCLE) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is circle cabinet!`, HttpStatus.I_AM_A_TEAPOT);
    }

    // TODO: Repository 함수 구현 필요.
    const lent_user_cnt: number = this.lentRepository.getLentUserCnt(cabinet_id);
    // 4. 잔여 자리가 있는지 확인
    if (lent_user_cnt === cabinet.max_user) {
      throw new HttpException(`cabinet_id: ${cabinet.cabinet_id} is full!`, HttpStatus.CONFLICT);
    }

    // 대여가 가능하므로 대여 시도
    // TODO:
    // 1. lent table에 insert
    // 2. user.is_lent를 true로 변경
    await this.lentRepository.lentCabinet(user, cabinet_id);
    await user.is_lent = true; // TODO: UserSessionDto에 is_lent 필드가 필요합니다.
    return cabinet;
  }
}
