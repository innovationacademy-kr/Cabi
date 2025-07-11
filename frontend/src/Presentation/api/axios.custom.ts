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

const axiosGetPresentationsURL = "/v6/presentations";
export const axiosGetPresentations = async (
  category: string = "ALL",
  sort: string = "TIME",
  page: number = 0,
  size: number = 6
): Promise<any> => {
  try {
    const response = await instance.get(axiosGetPresentationsURL, {
      params: {
        category,
        sort,
        page,
        size,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosPostPresentationLikeURL = "/v6/presentations";;
export const axiosPostPresentationLike = async (
  presentationId: string
): Promise<any> => {
  try {
    const response = await instance.post(
      `${axiosPostPresentationLikeURL}/${presentationId}/likes`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

const axiosDeletePresentationLikeURL = "/v6/presentations";
export const axiosDeletePresentationLike = async (
  presentationId: string
): Promise<any> => {
  try {
    const response = await instance.delete(
      `${axiosDeletePresentationLikeURL}/${presentationId}/likes`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
