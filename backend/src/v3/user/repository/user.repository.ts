import { MyCabinetInfoResponseDto } from 'src/dto/response/my.cabinet.info.response.dto';

export interface IUserRepository {
  /**
   * 특정 유저가 대여한 사물함 정보를 가져옵니다.
   *
   * @param userId 유저 아이디
   * @return MyCabinetInfoResponseDto | null
   */
  getCabinetByUserId(userId: number): Promise<MyCabinetInfoResponseDto | null>;
}
