/**
 * 캐비넷의 층별 사용량을 나타내는 DTO입니다.
 */
export class CabinetFloorDto {
  floor: number;

  total: number;

  used: number;

  overdue: number;

  unused: number;

  disabled: number;
}
