import { HttpStatusCode } from "axios";

export type ClubListReponseType =
  | ClubPaginationResponseDto
  | HttpStatusCode.BadRequest
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
  | HttpStatusCode.BadRequest
  | undefined;

export interface ClubCabinetInfo {
  building: string;
  floor: number;
  section: string;
  visibleNum: number;
}

export interface ClubInfoResponseDto extends ClubCabinetInfo {
  clubName: string;
  clubMaster: ClubUserResponseDto;
  clubMemo: string;
  clubNotice: string;
  clubUsers: ClubUserResponseDto[];
  clubUserCount: number;
}

export interface ClubUserResponseDto {
  userId: number;
  userName: string;
}
