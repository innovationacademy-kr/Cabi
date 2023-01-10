/**
 * 캐비넷 대여 사물함의 정보를 나타내는 DTO입니다.
 */
export class LentInfoDto {
    lent_id: number;
  
    lent_cabinet_id: number;
  
    lent_user_id: number;
  
    lent_time: Date;
  
    expire_time: Date;
  
    extension: number;
  
    intra_id: string;
  }
  