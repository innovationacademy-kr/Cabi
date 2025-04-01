import { TOAuthProvider } from "@/Cabinet/assets/data/oAuth";

export interface IUserOAuthLinkInfoDto {
  providerType: TOAuthProvider;
  email: string;
}
