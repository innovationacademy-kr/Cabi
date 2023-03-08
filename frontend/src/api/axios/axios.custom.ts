import CabinetStatus from "@/types/enum/cabinet.status.enum";
import CabinetType from "@/types/enum/cabinet.type.enum";
import instance from "./axios.instance";

const axiosLogoutUrl = "/auth/logout";

export const axiosLogout = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosLogoutUrl);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyInfoURL = "/api/my_info";
export const axiosMyInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetMemoURL = "/api/lent/update_cabinet_memo";
export const axiosUpdateCabinetMemo = async (
  cabinet_memo: object
): Promise<any> => {
  try {
    const response = await instance.patch(
      axiosUpdateCabinetMemoURL,
      cabinet_memo
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetTitleURL = "/api/lent/update_cabinet_title";
export const axiosUpdateCabinetTitle = async (
  cabinet_title: object
): Promise<any> => {
  try {
    const response = await instance.patch(
      axiosUpdateCabinetTitleURL,
      cabinet_title
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// V3 API
// TODO
// 차후 API 확인 후에 URL 수정
const axiosLocationFloorURL = "/api/cabinet_info";
export const axiosLocationFloor = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosLocationFloorURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetByLocationFloorURL = "/api/cabinet_info/";
export const axiosCabinetByLocationFloor = async (
  location: string,
  floor: number
): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosCabinetByLocationFloorURL}${location}/${floor}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetByIdURL = "/api/cabinet_info/";
export const axiosCabinetById = async (cabinetId: number): Promise<any> => {
  try {
    const response = await instance.get(`${axiosCabinetByIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentIdURL = "/api/lent/";
export const axiosLentId = async (cabinetId: number): Promise<any> => {
  try {
    const response = await instance.post(`${axiosLentIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyLentInfoURL = "/api/my_lent_info";
export const axiosMyLentInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnURL = "/api/lent/return";
export const axiosReturn = async (): Promise<any> => {
  try {
    const response = await instance.delete(axiosReturnURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyLentLogURL = "/api/my_lent_info/log";
export const axiosMyLentLog = async (page: number): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentLogURL, {
      params: { page: page, length: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Admin API
const axiosAdminCabinetInfoByIdURL = "/api/admin/cabinet/";
export const axiosAdminCabinetInfoByCabinetId = async (
  cabinetId: number
): Promise<any> => {
  try {
    const response = await instance.get(
      axiosAdminCabinetInfoByIdURL + cabinetId
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetCabinetStateURL = "/api/admin/cabinet/count/floor";
export const axiosGetCabinetState = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosGetCabinetStateURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosAdminReturnURL = "/api/admin/return/cabinet/";
export const axiosAdminReturn = async (cabinetId: number): Promise<any> => {
  try {
    const response = await instance.delete(axiosAdminReturnURL + cabinetId);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnByUserIdURL = "/api/admin/return/user/";
export const axiosReturnByUserId = async (userId: number): Promise<any> => {
  try {
    const response = await instance.delete(axiosReturnByUserIdURL + userId);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetTypeURL = "/api/admin/cabinet/lentType/";
export const axiosUpdateCabinetType = async (
  cabinetId: number,
  lentType: CabinetType
) => {
  try {
    const response = await instance.patch(
      `${axiosUpdateCabinetTypeURL}${cabinetId}/${lentType}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetStatusURL = "/api/admin/cabinet/status/";
export const axiosUpdateCabinetStatus = async (
  cabinetId: number,
  status: CabinetStatus
) => {
  try {
    const response = await instance.patch(
      `${axiosUpdateCabinetStatusURL}${cabinetId}/${status}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchByIntraIdURL = "/api/admin/search/intraId/";
export const axiosSearchByIntraId = async (intraId: string) => {
  try {
    const response = await instance.get(axiosSearchByIntraIdURL + intraId, {
      params: { page: 0, length: 10 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchByCabinetNumURL = "/api/admin/search/cabinet/visibleNum/";
export const axiosSearchByCabinetNum = async (number: number) => {
  try {
    const response = await instance.get(axiosSearchByCabinetNumURL + number);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosSearchDetailByIntraIdURL = "/api/admin/search/";
export const axiosSearchDetailByIntraId = async (
  intraId: string,
  page: number
) => {
  try {
    const response = await instance.get(
      axiosSearchDetailByIntraIdURL + intraId,
      {
        params: { page: page, length: 10 },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosDeleteCurrentBanLogURL = "/api/admin/log/ban/";
export const axiosDeleteCurrentBanLog = async (userId: number) => {
  try {
    const response = await instance.delete(
      axiosDeleteCurrentBanLogURL + userId.toString()
    );
    return response;
    } catch (error) {
    throw error;
  }
};

const axiosGetBrokenCabinetListURL =
  "/api/admin/search/cabinet/broken/?page=0&length=0";
export const axiosGetBrokenCabinetList = async () => {
  try {
    const response = await instance.get(axiosGetBrokenCabinetListURL);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const axiosGetBannedUserListURL =
  "/api/admin/search/user/banned/?page=0&length=0";
export const axiosGetBannedUserList = async () => {
  try {
    const response = await instance.get(axiosGetBannedUserListURL);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};

const axiosGetStatisticsURL = "/api/admin/search/cabinet/statistics/?";
export const axiosGetStatistics = async (start: number, end: number) => {
  try {
    const response = await instance.get(
      `${axiosGetStatisticsURL}start=${start}&end=${end}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const axiosGetCabinetNumbersPerFloorURL = "/api/admin/cabinet/count/floor";
export const axiosGetCabinetNumbersPerFloor = async () => {
  try {
    const response = await instance.get(axiosGetCabinetNumbersPerFloorURL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const axiosGetOverdueUserListURL =
  "api/admin/search/user/overdue?page=0&length=0";
export const axiosGetOverdueUserList = async () => {
  try {
    const response = await instance.get(axiosGetOverdueUserListURL);
    return response.data.result;
  } catch (error) {
    throw error;
  }
};
