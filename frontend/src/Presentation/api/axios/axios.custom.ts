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

const axiosMyPresentationLogURL = "/v6/presentations/me/histories";
export const axiosMyPresentationLog = async () => {
  try {
    const response = await instance.get(axiosMyPresentationLogURL);
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

/**
 * 수요지식회 리뉴얼 API
 */
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

const axiosGetPresentationsURL = "/v6/presentations";
export const axiosGetPresentations = async (
  category: string,
  sort: string,
  page: number,
  size: number
) => {
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
