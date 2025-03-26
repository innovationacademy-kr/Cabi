import { TOAuthProvider } from "@/Cabinet/assets/data/login";

// TODO : 주석 수정 필요. 연동 계정 정보 타입 정의
export interface IUserOAuthConnectionDto {
  providerType: TOAuthProvider;
  email: string;
}
