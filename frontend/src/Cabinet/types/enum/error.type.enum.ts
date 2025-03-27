enum ErrorType {
  LENT = "LENT",
  RETURN = "RETURN",
  STORE = "STORE",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  FORBIDDEN = "FORBIDDEN",
}

export enum OAuthErrorType {
  NOT_FT_LINK_STATUS = "NOT_FT_LINK_STATUS",
  OAUTH_EMAIL_ALREADY_LINKED = "OAUTH_EMAIL_ALREADY_LINKED",
  NOT_SUPPORT_OAUTH_TYPE = "NOT_SUPPORT_OAUTH_TYPE",
}

export default ErrorType;
// TODO : export default ErrorType; 를 지우고, ErrorType enum을 외부로 export 하기
