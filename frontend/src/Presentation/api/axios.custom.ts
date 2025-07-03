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


