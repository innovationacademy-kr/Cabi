import instance from "@/Cabinet/api/axios/axios.instance";

/**
 * 수요지식회 (구 까비지식회) API
 */
const axiosGetPresentationURL = "/v5/presentation/";
export const axiosGetPresentation = async () => {
  try {
    const response = await instance.get(axiosGetPresentationURL, {
      params: { pastFormCount: 1, upcomingFormCount: 3 },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetPresentationScheduleURL = "/v5/presentation/schedule/";
export const axiosGetPresentationSchedule = async (
  yearMonth: string
): Promise<any> => {
  try {
    const response = await instance.get(axiosGetPresentationScheduleURL, {
      params: { yearMonth },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosPostPresentationFormURL = "/v5/presentation/form";
export const axiosPostPresentationForm = async (
  subject: string,
  summary: string,
  detail: string,
  dateTime: Date,
  category: string,
  presentationTime: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosPostPresentationFormURL, {
      subject,
      summary,
      detail,
      dateTime: dateTime.toISOString(),
      category,
      presentationTime,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetInvalidDatesURL = "/v5/presentation/form/invalid-date";
export const axiosGetInvalidDates = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosGetInvalidDatesURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosMyPresentationLogURL = "/v5/presentation/me/histories";
export const axiosMyPresentationLog = async (page: number): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosMyPresentationLogURL}?page=${page}&size=10&sort=dateTime,desc`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetPresentationAbleDatesURL = "/v5/presentation/able-date";
export const axiosGetPresentationAbleDates = async (): Promise<any> => {
  try {
    const response = await instance.get(axiosGetPresentationAbleDatesURL);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * 수요지식회 (구 까비지식회) Admin API
 */
const axiosUpdatePresentationStatusURL =
  "/v5/admin/presentation/{formId}/update";
export const axiosUpdatePresentationStatus = async (
  formId: number,
  dateTime: string,
  status: string,
  location: string
): Promise<any> => {
  try {
    const response = await instance.patch(
      axiosUpdatePresentationStatusURL.replace("{formId}", formId.toString()),
      {
        dateTime,
        status,
        location,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosGetAdminPresentationScheduleURL = "/v5/admin/presentation/schedule/";
export const getAdminPresentationSchedule = async (
  yearMonth: string
): Promise<any> => {
  try {
    const response = await instance.get(axiosGetAdminPresentationScheduleURL, {
      params: { yearMonth },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAdminPresentationsByYearMonth = async (yearMonth: string) => {
  const response = await instance.get(
    `/v6/admin/presentations?yearMonth=${yearMonth}`
  );
  return response.data;
};

export const getAdminAvailableSlots = async (yearMonth: string) => {
  const response = await instance.get(
    `/v6/admin/presentations/slots?yearMonth=${yearMonth}&status=available`
  );
  return response.data;
};

export const getAdminPresentationDetail = async (presentationId: number) => {
  const response = await instance.get(
    `/v6/admin/presentations/${presentationId}`
  );
  return response.data;
};

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

const axiosGetPresentationCommentsURL = "/v6/presentations/";
export const axiosGetPresentationComments = async (presentationId: string) => {
  try {
    const response = await instance.get(
      `${axiosGetPresentationCommentsURL}${presentationId}/comments`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const axiosPostPresentationComment = async (
  presentationId: string,
  detail: string
) => {
  try {
    const response = await instance.post(
      `${axiosGetPresentationCommentsURL}${presentationId}/comments`,
      { detail }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const axiosPatchPresentationComment = async (
  presentationId: string,
  commentId: number,
  detail: string
) => {
  try {
    const response = await instance.patch(
      `/v6/presentations/${presentationId}/comments/${commentId}`,
      { detail }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const axiosDeletePresentationComment = async (
  presentationId: string,
  commentId: number
) => {
  try {
    const response = await instance.delete(
      `/v6/presentations/${presentationId}/comments/${commentId}`
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

const axiosCreateAdminPresentationSlotURL = "/v6/admin/presentations/slots";
export const axiosCreateAdminPresentationSlot = async (
  startTime: string,
  presentationLocation: string
): Promise<any> => {
  try {
    const response = await instance.post(axiosCreateAdminPresentationSlotURL, {
      startTime,
      presentationLocation,
    });
    return response;
  } catch (error) {
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

const axiosPostPresentationLikeURL = "/v6/presentations";
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
};

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
};

export const axiosUpdateAdminPresentation = async (
  presentationId: string,
  startTime: string,
  location: string,
  title: string
) => {
  const response = await instance.patch(
    `/v6/admin/presentations/${presentationId}`,
    {
      startTime,
      presentationLocation: location,
      title,
    }
  );
  return response.data;
};

export const axiosDeleteAdminPresentation = async (presentationId: string) => {
  const response = await instance.delete(
    `/v6/admin/presentations/${presentationId}`
  );
  return response.data;
};

export const axiosUpdateAdminSlot = async (
  slotId: string,
  startTime: string,
  location: string
) => {
  const response = await instance.patch(
    `/v6/admin/presentations/slots/${slotId}`,
    {
      startTime,
      presentationLocation: location,
    }
  );
  return response.data;
};

export const axiosDeleteAdminSlot = async (slotId: string) => {
  const response = await instance.delete(
    `/v6/admin/presentations/slots/${slotId}`
  );
  return response.data;
};

const axiosAdminGetPresentationByIdURL = "/v6/admin/presentations/";
export const axiosAdminGetPresentationById = async (
  presentationId: string
): Promise<any> => {
  try {
    const response = await instance.get(
      `${axiosAdminGetPresentationByIdURL}${presentationId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const axiosAdminGetPresentationCommentsURL = "/v6/admin/presentations/";
export const axiosAdminGetPresentationComments = async (
  presentationId: string
) => {
  try {
    const response = await instance.get(
      `${axiosAdminGetPresentationCommentsURL}${presentationId}/comments`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
