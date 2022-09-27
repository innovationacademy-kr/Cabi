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

const axiosExtensionUrl = "/api/extension";
export const axiosExtension = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosExtensionUrl);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentUrl = "/api/lent";
export const axiosLent = async (cabinet_id: number): Promise<any> => {
  try {
    const response = await instance.post(axiosLentUrl, {
      cabinet_id,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnUrl = "/api/return";
export const axiosReturn = async (lent_id: number): Promise<any> => {
  try {
    const response = await instance.post(axiosReturnUrl, { lent_id });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyInfoURL = "/v3/api/my_info";
export const axiosMyInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentInfoURL = "/api/lent_info";
export const axiosLentInfo = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosLentInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetInfoURL = "/api/cabinet";
export const axiosCabinetInfo = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosCabinetInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosReturnInfoURL = "/api/return_info";
export const axiosReturnInfo = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosReturnInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetMemoURL =
  "/v3/api/lent/update_cabinet_title/{cabinet_title}";
export const axiosUpdateCabinetMemo = async (memo: string): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateCabinetMemoURL, memo);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetTitleURL =
  "/v3/api/lent/update_cabinet_title/{cabinet_title}";
export const axiosUpdateCabinetTitle = async (title: string): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateCabinetTitleURL, title);
    return response;
  } catch (error) {
    throw error;
  }
};

// V3 API
// TODO
// 차후 API 확인 후에 URL 수정
const axiosLocationFloorURL = "/v3/api/cabinet_info";
export const axiosLocationFloor = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosLocationFloorURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosCabinetByLocationFloorURL = "/v3/api/cabinet_info/";
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

const axiosCabinetByIdURL = "/v3/api/cabinet_info/";
export const axiosCabinetById = async (cabinetId: number): Promise<any> => {
  try {
    const response = await instance.get(`${axiosCabinetByIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosLentIdURL = "/v3/api/lent/";
export const axiosLentId = async (cabinetId: number): Promise<any> => {
  try {
    const response = await instance.post(`${axiosLentIdURL}${cabinetId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyLentInfoURL = "/v3/api/my_lent_info";
export const axiosMyLentInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};
