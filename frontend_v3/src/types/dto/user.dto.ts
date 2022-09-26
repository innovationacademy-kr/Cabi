export interface UserDto {
  user_id: number; // 42 고유 ID
  intra_id: string; // 42 로그인 ID
  cabinet_id: number; // 42 이메일 ID (확장성을 위해 옵셔널 필드로 지정)
}
