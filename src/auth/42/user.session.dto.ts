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
}
