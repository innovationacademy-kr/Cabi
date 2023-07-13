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
export const axiosReturnByUserId = async (userId: number): Promise<any> => {
  try {
    const response = await instance.patch(axiosReturnByUserIdURL + userId);
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
        params: { page: page, size: 10 },
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
        params: { page: page, size: 10 },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetClubUserLogURL = "/v4/admin/users/clubs";
export const axiosGetClubUserLog = async (page: number): Promise<any> => {
  try {
    const response = await instance.get(axiosGetClubUserLogURL, {
      params: { page: page, size: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCreateClubUserURL = "/v4/admin/users/club";
export const axiosCreateClubUser = async (clubName: string | null): Promise<any> => {
  if (clubName === null) return;
  try {
    const response = await instance.post(
      axiosCreateClubUserURL,
      { clubName },
      { headers: { "Content-Type": "plain/text" } }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosDeleteClubUserURL = "/v4/admin/users/club/";
export const axiosDeleteClubUser = async (clubId: number | null): Promise<any> => {
  if (clubId === null) return ;
  try {
    const response = await instance.delete(
      axiosDeleteClubUserURL + clubId?.toString()
    );
    return response;
  } catch (error) {
    throw error;
  }
};
