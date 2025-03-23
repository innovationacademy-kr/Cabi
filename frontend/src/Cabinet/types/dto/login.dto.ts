import { LoginProvider } from "@/Presentation/types/common/loginType";

// 연동 계정 정보 타입 정의
export interface IUserOAuthConnectionDto {
  providerType: LoginProvider;
  email: string;
}
