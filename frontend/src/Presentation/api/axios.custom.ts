import instance from "@/Cabinet/api/axios/axios.instance";

const axiosGetPresentationByIdURL = "/v6/presentations/";
export const axiosGetPresentationById = async (
  presentationId: string
): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosGetPresentationByIdURL}${presentationId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};


const axiosGetPresentationsSlotURL = "/v6/presentations/slots";
// const axiosGetPresentationsSlotURL = "/v6/presentations?type=slots";
export const axiosGetPresentationsSlot = async () => {
  try {
    const response = await instance.get(axiosGetPresentationsSlotURL);
    return response;
  } catch (error: any) {
    // 상세한 에러 정보 로깅
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    throw error;
  }
}

const axiosCreatePresentationURL = "/v6/presentations";
export const axiosCreatePresentation = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await instance.post(
      axiosCreatePresentationURL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdatePresentationURL = "/v6/presentations/";
export const axiosUpdatePresentation = async (
  presentationId: string,
  formData: FormData
): Promise<any> => {
  try {
    const response = await instance.patch(
      `${axiosUpdatePresentationURL}${presentationId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};