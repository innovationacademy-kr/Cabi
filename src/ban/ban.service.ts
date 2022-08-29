import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { overUserInfoDto } from './dto/overUserInfo.dto';
import mariadb from 'mariadb';
import { banUserAddInfoDto } from './dto/banUserAddInfo.dto';
import { IBanRepository } from './repository/ban.repository';

@Injectable()
export class BanService {
  private logger = new Logger(BanService.name);
  constructor(private banRepository: IBanRepository) {}

  /**
   * n일 이상 연체자 조회
   * FIXME: v1의 banModel.ts
   * @param days 연체일
   * @return userInfo 리스트 or undefined
   */
  async getOverUser(days: number): Promise<overUserInfoDto[] | undefined> {
    try {
      return await this.banRepository.getOverUser(days);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  /**
	* 유저 권한 ban(1) 으로 변경
	* FIXME: v1의 banModel.ts
	FIXME: 현재 유저의 auth를 ban으로 바꾸는 용도로만 쓰여 ban service에 있지만
	 *		공유 사물함 기능이 추가 되면 다른 용도로도 쓰일 수 있으므로 auth service로 이동 필요.
	* @param userId 유저 PK
	*/
  async updateUserAuth(userId: number): Promise<void> {
    try {
      return await this.banRepository.updateUserAuth(userId);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 캐비넷 activation 변경
   * FIXME: v1의 banModel.ts
   * FIXME: 현재 강제 반납 사물함 비활성화 처리로만 쓰여 ban service에 있지만
   * 		 공유 사물함 기능이 추가 되면 다른 용도로도 쓰일 수 있으므로 cabinet service로 이동 필요.
   * @param cabinetId 캐비넷 PK
   * @param activation 캐비넷 상태 값
   */
  async updateCabinetActivation(
    cabinetId: number,
    activation: number,
  ): Promise<void> {
    try {
      return await this.banRepository.updateCabinetActivation(
        cabinetId,
        activation,
      );
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * banUser 추가
   * FIXME: v1의 banModel.ts
   * @param banUser 추가될 유저 정보
   */
  async addBanUser(banUser: banUserAddInfoDto) {
    try {
      return await this.banRepository.addBanUser(banUser);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  /**
   * 해당 유저가 Ban처리 되어있는지 확인
   * FIXME: v1의 queryModel.ts
   * FIXME: 정확히 어떤 타입을 return 하는지 명시 필요.
   * @param user_id 추가될 유저의 id
   */
  async checkBannedUserList(user_id: number) {
    try {
      return await this.banRepository.checkBannedUserList(user_id);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
