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
  clubName: string;
  clubMaster: string;
}

export type ClubInfoResponseType =
  | ClubInfoResponseDto
  | typeof STATUS_400_BAD_REQUEST
  | undefined;

export interface ClubCabinetInfo {
  building: string;
  floor: number;
  section: string;
  visibleNum: number;
}

export interface ClubInfoResponseDto extends ClubCabinetInfo {
  clubName: string;
  clubMaster: string;
  clubMemo: string;
  clubNotice: string;
  clubUsers: ClubUserResponseDto[];
  clubUserCount: number;
}

export interface ClubUserResponseDto {
  userId: number;
  userName: string;
}
