/**
 * cabi 관리 대상인 사물함의 건물 정보와 층 수의 정보를 저장
 */
export class SpaceDataDto {
  location: number; // 건물 정보 (ex. 새롬관)
  floors: number[]; // 해당 건물에 존재하는 층 정보의 배열
}
