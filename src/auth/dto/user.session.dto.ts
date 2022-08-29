/**
 * 로그인한 사용자의 데이터를 저장하는 DTO
 */
export class UserSessionDto {
  /**
   * 42 계정 고유 ID
   */
  user_id: number;

  /**
   * 42 로그인 ID
   */
  intra_id: string;

  /**
   * 42 이메일
   */
  email: string;

  /**
   * 42 계정 전화번호
   */
  phone?: string;

  /**
   * 발급 시간
   */
  iat?: number;

  /**
   * 만료 시간
   */
  ext?: number;
}
