export interface UserDto {
  user_id: number; // 42 고유 ID
  intra_id: string; // 42 로그인 ID
  // TODO:
  // mock 데이터와 충돌 생겨서 옵셔널 필드로 바꿨습니다. 추후 수정 필요합니다.
  cabinet_id: number; // 캐비닛 고유 ID
}
