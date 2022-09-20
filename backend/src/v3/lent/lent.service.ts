import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MyCabinetInfoResponseDto } from "src/dto/response/my.cabinet.info.response.dto";
import { UserSessionDto } from "src/dto/user.session.dto";

@Injectable()
export class LentService {
  constructor(private lentRepository: ILentRepository) {}
  async lentCabinet(cabinet_id: number, user: UserSessionDto): Promise<MyCabinetInfoResponseDto> {
    // 1. 동아리 사물함인지 확인
    const cabinet: CabinetDto
    // 2. 해당 유저가 대여중인 사물함이 있는지 확인
    if (user.is_lent) {
      throw new HttpException(` already lent cabinet!`, HttpStatus.FORBIDDEN);
    }
    //
    return new MyCabinetInfoResponseDto();
  }
}
