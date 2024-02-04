import { STATUS_400_BAD_REQUEST } from "@/constants/StatusCode";

export type ClubListReponseType =
  | ClubPaginationResponseDto
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface ClubPaginationResponseDto {
  result: ClubResponseDto[];
  totalLength: number;
}

export interface ClubResponseDto {
  clubId: number;
  clubName: String;
  clubMaster: String;
}

export type ClubInfoResponseType =
  | ClubInfoResponseDto
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface ClubInfoResponseDto {
  clubName: String;
  clubMaster: String;
  clubMemo: String;
  clubNotice: String;
  building: String;
  floor: number;
  section: String;
  visibleNum: number;
  clubUsers: ClubUserResponseDto[];
  clubUserCount: number;
}

export interface ClubUserResponseDto {
  userId: number;
  userName: String;
}
