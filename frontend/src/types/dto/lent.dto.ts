export interface LentDto {
  user_id: number; // 유저 인트라 번호
  intra_id: string; // 유저 인트라 아이디
  lent_id: number; // 대여 고유 ID
  lent_time: Date; // 대여한 시간
  expire_time: Date; // 만료 시간
  is_expired: boolean; // 연체 여부
}
