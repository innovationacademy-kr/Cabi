export interface IBanRepository {
  /**
   * 해당 유저의 가장 늦은 unbanned 날짜를 가져옴. 밴 당한적이 없다면 null 반환함.
   *
   * @param userId 유저 ID
   */
  getUnbanedDate(userId: number): Promise<Date | null>;
}
