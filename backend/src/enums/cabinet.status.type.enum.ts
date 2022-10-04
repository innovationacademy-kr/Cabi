/**
 * 사물함의 상태를 나타냄
 */
enum CabinetStatusType {
  AVAILABLE = 'AVAILABLE',
  NOT_SET_EXPIRE_FULL = 'NOT_SET_EXPIRE_FULL',
  SET_EXPIRE_FULL = 'SET_EXPIRE_FULL',
  SET_EXPIRE_AVAILABLE = 'SET_EXPIRE_AVAILABLE',
  BROKEN = 'BROKEN',
  BANNED = 'BANNED',
}
export default CabinetStatusType;
