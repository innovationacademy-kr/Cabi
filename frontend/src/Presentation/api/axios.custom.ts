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
    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    throw error;
  }
};

const axiosCreatePresentationURL = "/v6/presentations";
export const axiosCreatePresentation = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await instance.post(axiosCreatePresentationURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosUpdatePresentationURL = "/v6/presentations/";
export const axiosUpdatePresentation = async (
  presentationId: string,
  body: any,
  thumbnailFile: File | null
): Promise<any> => {
  try {
    // console.log("body : ", body);
    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify(body)], { type: "application/json" })
    );
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
      // console.log("추가됨")
      // formData.append("thumbnailUpdated", "true");
    } 
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name}`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    const response = await instance.patch(
      `/v6/presentations/${presentationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
