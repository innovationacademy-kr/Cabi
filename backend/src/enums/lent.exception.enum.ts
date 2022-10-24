/**
 * lentStateTransition에서 return할 예외사항
 */
enum LentExceptionType {
  LENT_CIRCLE = 'LENT_CIRCLE',
  ALREADY_LENT = 'ALREADY_LENT',
  LENT_FULL = 'LENT_FULL',
  LENT_EXPIRED = 'LENT_EXPIRED',
  LENT_BROKEN = 'LENT_BROKEN',
  LENT_BANNED = 'LENT_BANNED',
  LENT_SUCCESS = 'LENT_SUCCESS',
}
export default LentExceptionType;
