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
