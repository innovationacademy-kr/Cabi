/**
 * 사물함의 상태를 나타냄
 */
enum CabinetStatusType {
  AVAILABLE = 'AVAILABLE',
  SET_EXPIRE_FULL = 'SET_EXPIRE_FULL',
  SET_EXPIRE_AVAILABLE = 'SET_EXPIRE_AVAILABLE',
  EXPIRED = 'EXPIRED',
  BROKEN = 'BROKEN',
  BANNED = 'BANNED',
}
export default CabinetStatusType;
