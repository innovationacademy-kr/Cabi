import { useLocation } from "react-router-dom";
import instance from "@/Cabinet/api/axios/axios.instance";
import { getCookie } from "@/Cabinet/api/react_cookie/cookies";

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

/**
 * 수요지식회 리뉴얼 API
 */

const axiosGetPresentationByIdURL = "/v6/presentations/";
export const axiosGetPresentationById = async (
  presentationId: string
): Promise<any> => {
  try {
    const accessToken = getCookie("access_token");
    // console.log("axiosGetPresentationById");
    // // const location = useLocation();
    // console.log("location.pathname : ",location.pathname)
    // const isAdminPage: boolean = location.pathname === "/admin/presentations/";
    const response = await instance.get(
      `${axiosGetPresentationByIdURL}${presentationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
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
    console.log("body : ", body);
    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify(body)], { type: "application/json" })
    );
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    const response = await instance.patch(
      `${axiosUpdatePresentationURL}${presentationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.log("에러여기걸리나");
    const err = error as any;
    console.error("API Error Details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      headers: err.response?.headers,
      config: err.config,
    });
    throw error;
  }
};
const axiosUpdateAdminPresentationURL = "/v6/admin/presentations/";
export const axiosUpdateAdminPresentation = async (
  presentationId: string,
  body: any,
  thumbnailFile: File | null
): Promise<any> => {
  try {
    console.log("body : ", body);
    const accessToken = getCookie("access_token");
    const formData = new FormData();
    formData.append(
      "form",
      new Blob([JSON.stringify(body)], { type: "application/json" })
    );
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }
    const response = await instance.patch(
      `${axiosUpdateAdminPresentationURL}${presentationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// const axiosGetPresentationsURL = "/v6/presentations";
// export const axiosGetPresentations = async (
//   category: string = "ALL",
//   sort: string = "TIME",
//   page: number = 0,
//   size: number = 6
// ): Promise<any> => {
//   try {
//     const response = await instance.get(axiosGetPresentationsURL, {
//       params: {
//         category,
//         sort,
//         page,
//         size,
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

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
