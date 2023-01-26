import adminInstance from "./axios.admin.instance";

const axiosLentURL = "/api/admin/lent";
export const axiosLent = async () => {
  try {
    const response = await adminInstance.get(axiosLentURL);
    return response;
  } catch (error) {
    throw error;
  }
};
