import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CabinetDto } from "src/dto/cabinet.dto";
import { MyCabinetInfoResponseDto } from "src/dto/response/my.cabinet.info.response.dto";
import { UserSessionDto } from "src/dto/user.session.dto";
import LentType from "src/enums/lent.type.enum";

@Injectable()
export class LentService {
  constructor(private lentRepository: ILentRepository) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 해당 유저가 대여중인 사물함이 있는지 확인
    if (user.is_lent) { // TODO: UserSessionDto에 is_lent 필드가 필요합니다.
      throw new HttpException(` already lent cabinet!`, HttpStatus.FORBIDDEN);
    }
    const cabinet: CabinetDto = this.lentRepository.getCabiInfo(cabinet_id);
    // 2. 동아리 사물함인지 확인
    if (cabinet.lent_type === LentType.CIRCLE) {
      throw new HttpException(`${cabinet.cabinet_num} is circle cabinet!`, HttpStatus.I_AM_A_TEAPOT);
    }
    // 3. 잔여 자리가 있는지 확인
    if (cabinet.lent_type === LentType.PRIVATE && cabinet)
    if (cabinet.) // TODO: CabinetDto와 Cabinet Entity에 현재 캐비넷 사용자 수를 저장할 프로퍼티/필드가 필요합니다.
    return new MyCabinetInfoResponseDto();
  }
}
