/**
 * @description 유저 알림 정보
 * @interface
 * @property {boolean} email : 이메일 알림 여부
 * @property {boolean} push : 웹 (브라우저) 푸시 알림 여부
 * @property {boolean} slack : 슬랙 알림 여부
 */
export interface AlarmInfo {
  email: boolean;
  push: boolean;
  slack: boolean;
}
