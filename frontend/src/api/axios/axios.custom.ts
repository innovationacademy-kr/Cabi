import { AlarmInfo } from "@/types/dto/alarm.dto";
import { ClubUserDto } from "@/types/dto/lent.dto";
import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import instance from "@/api/axios/axios.instance";

const axiosLogoutUrl = "/v4/auth/logout";
export const axiosLogout = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosLogoutUrl);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyInfoURL = "/v4/users/me";
export const axiosMyInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyExtensionsInfoURL = "/v4/users/me/lent-extensions";
export const axiosMyExtensionsInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyExtensionsInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosActiveExtensionInfoURL = "/v4/users/me/lent-extensions/active";
export const axiosActiveExtensionInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosActiveExtensionInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUseExtensionURL = "/v4/users/me/lent-extensions";
export const axiosUseExtension = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosUseExtensionURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateAlarmURL = "/v4/users/me/alarms";
export const axiosUpdateAlarm = async (alarm: AlarmInfo): Promise<any> => {
  try {
    const response = await instance.put(axiosUpdateAlarmURL, alarm);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateDeviceTokenURL = "/v4/users/me/device-token";
export const axiosUpdateDeviceToken = async (
  deviceToken: string | null
): Promise<any> => {
  try {
    const response = await instance.put(axiosUpdateDeviceTokenURL, {
      deviceToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyClubListURL = "/v4/clubs";
export const axiosMyClubList = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyClubListURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetClubInfoURL = "/v4/clubs/";
export const axiosGetClubInfo = async (
  clubId: number,
  page: number,
  size: number
): Promise<any> => {
  try {
    const response = await instance.get(
      axiosGetClubInfoURL + clubId.toString(),
      {
        params: { page: page, size: size },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosAddClubMemberURL = "/v4/clubs";
export const axiosAddClubMember = async (
  clubId: number,
  name: String
): Promise<any> => {
  // TODO : 예외처리?
  try {
    const response = await instance.post(
      `${axiosAddClubMemberURL}/${clubId}/users`,
      {
        name,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMandateClubMemURL = "/v4/clubs";
export const axiosMandateClubMember = async (
  clubId: number,
  clubMaster: string
): Promise<any> => {
  // TODO : 예외처리?
  try {
    const response = await instance.post(
      `${axiosMandateClubMemURL}/${clubId}/mandate`,
      { clubMaster }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosDeleteClubMemberURL = "/v4/clubs/";
export const axiosDeleteClubMember = async (
  clubId: number,
  userId: number
): Promise<any> => {
  try {
    const response = await instance.delete(
      `${axiosDeleteClubMemberURL}${clubId}/users/${userId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateClubMemoURL = "/v4/clubs/";
export const axiosUpdateClubMemo = async (
  clubId: number,
  clubMemo: string
): Promise<any> => {
  try {
    const response = await instance.post(
      `${axiosUpdateClubMemoURL}${clubId}/memo`,
      {
        memo: clubMemo,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateClubNoticeURL = "/v4/clubs/";
export const axiosUpdateClubNotice = async (
  clubId: number,
  notice: string
): Promise<any> => {
  try {
    const response = await instance.post(
      `${axiosUpdateClubNoticeURL}${clubId}/notice`,
      {
        notice,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// V3 API
const axiosBuildingFloorURL = "/v4/cabinets/buildings/floors";
export const axiosBuildingFloor = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosBuildingFloorURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetByBuildingFloorURL = "/v4/cabinets/buildings/";
export const axiosCabinetByBuildingFloor = async (
  Building: string,
  floor: number
): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosCabinetByBuildingFloorURL}${Building}/floors/${floor}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetByIdURL = "/v4/cabinets/";
export const axiosCabinetById = async (
  cabinetId: number | null
): Promise<any> => {
  if (cabinetId === null) return;
  try {
    const response = await instance.get(`${axiosCabinetByIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentIdURL = "/v4/lent/cabinets/";
export const axiosLentId = async (cabinetId: number | null): Promise<any> => {
  if (cabinetId === null) return;
  try {
    const response = await instance.post(`${axiosLentIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyLentInfoURL = "/v4/lent/me";
export const axiosMyLentInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSwapIdURL = "/v4/lent/swap/";
export const axiosSwapId = async (cabinetId: number | null): Promise<any> => {
  if (cabinetId === null) return;
  try {
    const response = await instance.post(`${axiosSwapIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateMyCabinetInfoURL = "/v4/lent/me/cabinet";
export const axiosUpdateMyCabinetInfo = async (
  title: string | null,
  memo: string | null
): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateMyCabinetInfoURL, {
      title,
      memo,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnURL = "/v4/lent/return";
export const axiosReturn = async (): Promise<any> => {
  try {
    const response = await instance.patch(axiosReturnURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSendCabinetPasswordURL = "/v4/lent/return-memo";
export const axiosSendCabinetPassword = async (password: string) => {
  try {
    const response = await instance.patch(axiosSendCabinetPasswordURL, {
      cabinetMemo: password,
    });
  } catch (error) {
    throw error;
  }
};

const axiosMyLentLogURL = "/v4/lent/me/histories";
export const axiosMyLentLog = async (page: number): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentLogURL, {
      params: { page: page, size: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosExtendLentPeriodURL = "/v4/lent/cabinets/extend";
export const axiosExtendLentPeriod = async (): Promise<any> => {
  try {
    const response = await instance.patch(axiosExtendLentPeriodURL);
    return response;
  } catch (error) {
    throw error;
  }
};

// Admin API
const axiosAdminAuthLoginURL = "/v4/admin/auth/login";
export const axiosAdminAuthLogin = async (
  id: string,
  password: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosAdminAuthLoginURL, {
      id,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosAdminCabinetInfoByIdURL = "/v4/admin/cabinets/";
export const axiosAdminCabinetInfoByCabinetId = async (
  cabinetId: number | null
): Promise<any> => {
  if (cabinetId === null) return;
  try {
    const response = await instance.get(
      axiosAdminCabinetInfoByIdURL + cabinetId
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnByUserIdURL = "/v4/admin/return-users/";
export const axiosReturnByUserId = async (userIds: number[]): Promise<any> => {
  try {
    const response = await instance.patch(axiosReturnByUserIdURL, {
      userIds: userIds,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosBundleReturnURL = "/v4/admin/return-cabinets";
export const axiosBundleReturn = async (
  cabinetIdList: number[]
): Promise<any> => {
  try {
    const response = await instance.patch(axiosBundleReturnURL, {
      cabinetIds: cabinetIdList,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetsURL = "/v4/admin/cabinets/";
export const axiosUpdateCabinets = async (
  cabinetIds: number[],
  lentType: CabinetType | null,
  status: CabinetStatus | null
): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateCabinetsURL, {
      cabinetIds,
      lentType,
      status,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchByIntraIdURL = "/v4/admin/search/users-simple";
export const axiosSearchByIntraId = async (intraId: string) => {
  try {
    const response = await instance.get(axiosSearchByIntraIdURL, {
      params: { name: intraId, page: 0, size: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchByCabinetNumURL = "/v4/admin/search/cabinets";
export const axiosSearchByCabinetNum = async (number: number) => {
  try {
    const response = await instance.get(axiosSearchByCabinetNumURL, {
      params: { visibleNum: number },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchByCabinetNumSimpleURL = "/v4/admin/search/cabinets-simple";
export const axiosSearchByCabinetNumSimple = async (number: number) => {
  try {
    const response = await instance.get(axiosSearchByCabinetNumSimpleURL, {
      params: { visibleNum: number },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchDetailByIntraIdURL = "/v4/admin/search/users";
export const axiosSearchDetailByIntraId = async (
  intraId: string,
  page: number
) => {
  try {
    const response = await instance.get(axiosSearchDetailByIntraIdURL, {
      params: { name: intraId, page: page, size: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosDeleteCurrentBanLogURL = "/v4/admin/users/";
export const axiosDeleteCurrentBanLog = async (userId: number | null) => {
  if (userId === null) return;
  try {
    const response = await instance.delete(
      axiosDeleteCurrentBanLogURL + userId?.toString() + "/ban-history"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetBrokenCabinetListURL = "/v4/admin/cabinets/status/BROKEN";
export const axiosGetBrokenCabinetList = async () => {
  try {
    const response = await instance.get(axiosGetBrokenCabinetListURL, {
      params: { page: 0, size: 0 },
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const axiosGetBannedUserListURL = "v4/admin/statistics/users/banned";
export const axiosGetBannedUserList = async () => {
  try {
    const response = await instance.get(axiosGetBannedUserListURL, {
      params: { page: 0, size: 0 },
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const axiosGetStatisticsURL = "/v4/admin/statistics/lent-histories";
export const axiosGetStatistics = async (start: Date, end: Date) => {
  try {
    const response = await instance.get(axiosGetStatisticsURL, {
      params: { startDate: start, endDate: end },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const axiosGetCabinetNumbersPerFloorURL =
  "/v4/admin/statistics/buildings/floors/cabinets";
export const axiosGetCabinetNumbersPerFloor = async () => {
  try {
    const response = await instance.get(axiosGetCabinetNumbersPerFloorURL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const axiosGetOverdueUserListURL = "/v4/admin/statistics/users/overdue";
export const axiosGetOverdueUserList = async () => {
  try {
    const response = await instance.get(axiosGetOverdueUserListURL, {
      params: { page: 0, size: 0 },
    });
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const axiosGetCabinetLentLogURL = "/v4/admin/cabinets/";
export const axiosGetCabinetLentLog = async (
  cabinetId: number | null,
  page: number
): Promise<any> => {
  if (cabinetId == null) return;
  try {
    const response = await instance.get(
      axiosGetCabinetLentLogURL + cabinetId.toString() + "/lent-histories",
      {
        params: { page: page, size: 8 },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetUserLentLogURL = "/v4/admin/users/";
export const axiosGetUserLentLog = async (
  userId: number | null,
  page: number
): Promise<any> => {
  if (userId == null) return;
  try {
    const response = await instance.get(
      axiosGetUserLentLogURL + userId.toString() + "/lent-histories",
      {
        params: { page: page, size: 8 },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetClubUserLogURL = "/v4/admin/clubs";
export const axiosGetClubUserLog = async (
  page: number,
  size: number
): Promise<any> => {
  try {
    const response = await instance.get(axiosGetClubUserLogURL, {
      params: { page: page, size: size },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCreateClubUserURL = "/v4/admin/clubs";
export const axiosCreateClubUser = async (
  clubName: string | null,
  clubMaster: string | null
): Promise<any> => {
  if (clubName === null || clubMaster === null) return;
  try {
    const response = await instance.post(axiosCreateClubUserURL, {
      clubName,
      clubMaster,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosEditClubUserURL = "/v4/admin/clubs/";
export const axiosEditClubUser = async (
  clubInfo: ClubUserDto
): Promise<any> => {
  try {
    const response = await instance.patch(
      axiosEditClubUserURL + clubInfo.clubId.toString(),
      {
        clubName: clubInfo.clubName,
        clubMaster: clubInfo.clubMaster,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosDeleteClubUserURL = "/v4/admin/clubs/";
export const axiosDeleteClubUser = async (
  clubId: number | null
): Promise<any> => {
  if (clubId === null) return;
  try {
    const response = await instance.delete(
      axiosDeleteClubUserURL + clubId?.toString()
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// const axiosLentClubUserURL = "/v4/admin/cabinets/club";
// export const axiosLentClubUser = async (
//   userId: number,
//   cabinetId: number,
//   statusNote: string | null
// ): Promise<any> => {
//   try {
//     const response = await instance.patch(axiosLentClubUserURL, {
//       userId,
//       cabinetId,
//       statusNote,
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// Lent Cabinet to Club {cabinetId} to {clubId}
// /v4/admin/clubs/{clubId}/cabinets/{cabinetId}

const axiosLentClubCabinetURL = "/v4/admin/clubs/";
export const axiosLentClubCabinet = async (
  clubId: number,
  cabinetId: number
): Promise<any> => {
  try {
    const response = await instance.post(
      axiosLentClubCabinetURL +
        clubId.toString() +
        "/cabinets/" +
        cabinetId.toString()
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentShareIdURL = "/v4/lent/cabinets/share/";
export const axiosLentShareId = async (
  cabinetId: number | null,
  shareCode: string
): Promise<any> => {
  if (cabinetId === null) return;
  try {
    const response = await instance.post(`${axiosLentShareIdURL}${cabinetId}`, {
      shareCode,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCancelURL = "/v4/lent/cabinets/share/cancel/";
export const axiosCancel = async (cabinetId: number | null): Promise<any> => {
  if (cabinetId === null) {
    return;
  }
  try {
    const response = await instance.patch(`${axiosCancelURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetAvailableCabinetsURL = "/v4/cabinets/buildings/새롬관/available";
export const axiosGetAvailableCabinets = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosGetAvailableCabinetsURL);
    return response;
  } catch (error) {
    throw error;
  }
};

// 수지회
const axiosGetPresentationScheduleURL = "/v5/presentation/schedule/";
export const axiosGetPresentationSchedule = async (
  yearMonth: string
): Promise<any> => {
  try {
    const response = await instance.get(
      axiosGetPresentationScheduleURL + yearMonth
    );
    return response;
  } catch (error) {
    throw error;
  }
};
