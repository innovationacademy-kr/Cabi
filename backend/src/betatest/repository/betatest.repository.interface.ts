export interface IBetatestRepository {
  /**
   * 유저의 밴 기록을 모두 삭제합니다.
   *
   * @param user_id 유저 ID
   */
  deleteBanLog(user_id: number): Promise<boolean>;
}
