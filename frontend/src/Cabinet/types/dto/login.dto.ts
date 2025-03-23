import { TLoginProvider } from "@/Cabinet/constants/login";

// 연동 계정 정보 타입 정의
export interface IUserOAuthConnectionDto {
  providerType: TLoginProvider;
  email: string;
}
