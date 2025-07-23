import api from "../api";
export const getAllCloudServices = async (
  pageIndex: number,
  pageSize: number,
  searchValue?: string
) => {
  const params = new URLSearchParams({
    pageIndex: String(pageIndex),
    pageSize: String(pageSize),
  });
    if (searchValue?.trim()) {
    params.append('searchFilter', searchValue);
  }
  try {
    const response = await api.get(`/hyperscaler/cloud-credentials/?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching cloud services:", err);
    throw err;
  }
};
export const createCloudService = async (data: any) => {
  try {
    const response = await api.post("/hyperscaler/cloud-credentials/", data);
    return response.data;
  } catch (err) {
    console.error("Error creating cloud service:", err);
    throw err;
  }
};
export const getCloudWithID = async () => {
  try {
    const response = await api.get("/hyperscaler/cloud-credentials/get-id/");
    return response.data;
  } catch (err) {
    console.error("Error fetching cloud service with ID:", err);
    throw err;
  }
};

export const UpdateCloudService = async (id: string, data: any) => {
  try {
    const response = await api.patch(
      `/hyperscaler/cloud-credentials/${id}/`,
      data
    );
    return response.data;
  } catch (err) {
    console.error("Error updating cloud service:", err);
    throw err;
  }
};
export const deleteCloudService = async (id: number) => {
  try {
    const response = await api.delete(`/hyperscaler/cloud-credentials/${id}/`);
    return response.data;
  } catch (err) {
    console.error("Error deleting cloud service:", err);
    throw err;
  }
};
