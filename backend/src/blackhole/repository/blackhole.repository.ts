export abstract class IBlackholeRepository {
  /**
   * 블랙홀에 빠진 유저를 DB에서 삭제한다.
   *
   * @Param intra_id: string
   * @return void
   */
  abstract deleteBlackholedUser(user_id: number): Promise<void>;

  /**
   * 블랙홀에 빠진 유저의 정보를 업데이트 한다.
   * @param user_id
   * 1. log_user 테이블에서 user_id를 음수로, intra_id를 [BLACKHOLED]${intra_id}로 업데이트
   * 2. ban_user 테이블에서 user_id를 음수로 업데이트
   * 3. user 테이블에서 user_id를 음수로, intra_id를 [BLACKHOLED]${intra_id}로 업데이트
   */
   abstract updateBlackholedUser(user_id: number, intra_id: string): Promise<void>;
}
