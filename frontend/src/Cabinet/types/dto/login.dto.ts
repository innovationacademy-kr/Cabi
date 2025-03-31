import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";

// TODO : 주석 수정 필요. 연결 계정 정보 타입 정의
export interface IUserOAuthLinkInfoDto {
  providerType: TOAuthProvider;
  email: string;
}
