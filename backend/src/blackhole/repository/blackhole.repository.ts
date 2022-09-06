export abstract class IBlackholeRepository {
  /**
   * 블랙홀에 빠진 유저를 DB에서 삭제한다.
   *
   * @Param intra_id: string
   * @return void
   */
  abstract deleteBlackholedUser(user_id: number): Promise<void>;
}
