/**
 * 로그인한 사용자의 데이터를 저장하는 DTO
 */
export class UserSessionDto {
  user_id: number; // 42 게정 고유 ID
  intra_id: string; // 42 로그인 ID
  email: string; // 42 이메일
  phone?: string; // 42 계정 전화번호
  iat?: number; // 발급 시간
  ext?: number; // 만료 시간
}
