import instance from "@/api/axios/axios.instance";

/**
 * 수요지식회 (구 까비지식회) API
 */
const axiosGetPresentationURL = "/v5/presentation/";
export const axiosGetPresentation = async () => {
  try {
    const response = await instance.get(axiosGetPresentationURL, {
      params: { pastFormCount: 1, upcomingFormCount: 2 },
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
