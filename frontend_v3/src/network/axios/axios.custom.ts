import instance from "./axios.instance";

const axiosLogoutUrl = "/auth/logout";

export const axiosLogout = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosLogoutUrl);
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

const axiosApiCheckUrl = "/api/check";
export const axiosApiCheck = async (): Promise<any> => {
  try {
    const response = await instance.post(axiosApiCheckUrl);
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

// TODO API 변경 후 적용사항
// location, floor에 따른 cabinets 반환
const axiosCabinetLocationInfoURL = "/api/cabinet_info/";
export const axiosCabinetLocationInfo = async (
  location: string,
  floor: number
): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosCabinetLocationInfoURL}${location}/${floor}`
    );
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

const axiosMyLentInfoURL = "/api/my_lent_info";
export const axiosMyLentInfo = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosMyLentInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

// TODO: my_lent_info API 분리 후 업데이트
const axiosUpdateCabinetMemoURL = "/api/";
export const axiosUpdateCabinetMemo = async (memo: string): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateCabinetMemoURL, memo);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdateCabinetTitleURL = "/api/";
export const axiosUpdateCabinetTitle = async (title: string): Promise<any> => {
  try {
    const response = await instance.patch(axiosUpdateCabinetTitleURL, title);
    return response;
  } catch (error) {
    throw error;
  }
};
