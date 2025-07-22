import api from "../api";
export const getAllGitServices = async () => {
    try {
        const response = await api.get('/hyperscaler/git-credentials/');
        return response.data;
    } catch (err) {
        console.error("Error fetching Git services:", err);
        throw err;  
    }
}
export const createGitService = async (data: any) => {
    try {
        const response = await api.post('/hyperscaler/git-credentials/', data);
        return response.data;
    } catch (err) {
        console.error("Error creating Git service:", err);
        throw err;  
    }
}
export const updateGitService = async (id: number, data: any) => {
    try {
        const response = await api.patch(`/hyperscaler/git-credentials/${id}/`, data);
        return response.data;
    } catch (err) {
        console.error("Error updating Git service:", err);
        throw err;  
    }
}
export const deleteGitService = async (id: number) => {
    try {
        const response = await api.delete(`/hyperscaler/git-credentials/${id}/`);
        return response.data;
    } catch (err) {
        console.error("Error deleting Git service:", err);
        throw err;  
    }
}
export const getGitServiceWithID = async () => {
    try {
        const response = await api.get(`/hyperscaler/git-credentials/get-id/`);
        return response.data;
    } catch (err) {
        console.error("Error fetching Git service with ID:", err);
        throw err;  
    }
}
