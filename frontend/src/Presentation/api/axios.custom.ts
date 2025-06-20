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
export const axiosGetPresentationsSlot = async () => {
  try {
    const response = await instance.get(axiosGetPresentationsSlotURL);
    return response;
  } catch (error){
    throw error;
  }
}
