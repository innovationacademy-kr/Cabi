import BanUser from 'src/entities/ban.user.entity';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { BanUserDto } from '../dto/ban.user.dto';
import { OverUserDto } from '../dto/over.user.dto';

// @CustomRepository(BanUser)
// export class BanRepository extends Repository<BanUser> {
//  /**
//    * n일 이상 연체자 조회
//    * @param days 연체일
//    * @return userInfoDto 리스트 or undefined
//    */
//   async getOverUser(days: number): Promise<OverUserDto[] | undefined> {
//     let overUserList: OverUserDto[] | undefined = [];

//     return 
//   };

//   /**
//    * 유저 권한 ban(1) 으로 변경
//    * @param userId 유저 PK
//    */
//   async updateUserAuth(userId: number): Promise<void> {
    
//   };

//   /**
//    * 캐비넷 activation 변경
//    * @param cabinetId 캐비넷 PK
//    * @param activation 캐비넷 상태 값
//    */
//   async updateCabinetActivation(
//     cabinetId: number,
//     activation: number,
//   ): Promise<void> {

//   };

//   /**
//    * banUser 추가
//    * @param banUser 추가될 유저 정보
//    */
//   async addBanUser(banUser: BanUserDto): Promise<void> {

//   };

//   /**
//    * 해당 유저가 Ban처리 되어있는지 확인
//    *
//    * @param user_id 추가될 유저의 id
//    * @return ban 되어있을 경우 1, 아니면 0
//    */
//   async checkBannedUserList(user_id: number): Promise<number> {
//     return ;
//   };
// }

export abstract class IBanRepository {
  /**
   * n일 이상 연체자 조회
   * @param days 연체일
   * @return userInfoDto 리스트 or undefined
   */
  abstract getOverUser(days: number): Promise<OverUserDto[] | undefined>;

  /**
   * 유저 권한 ban(1) 으로 변경
   * @param userId 유저 PK
   */
  abstract updateUserAuth(userId: number): Promise<void>;

  /**
   * 캐비넷 activation 변경
   * @param cabinetId 캐비넷 PK
   * @param activation 캐비넷 상태 값
   */
  abstract updateCabinetActivation(
    cabinetId: number,
    activation: number,
  ): Promise<void>;

  /**
   * banUser 추가
   * @param banUser 추가될 유저 정보
   */
  abstract addBanUser(banUser: BanUserDto): Promise<void>;

  /**
   * 해당 유저가 Ban처리 되어있는지 확인
   *
   * @param user_id 추가될 유저의 id
   * @return ban 되어있을 경우 1, 아니면 0
   */
  abstract checkBannedUserList(user_id: number): Promise<number>;
}
