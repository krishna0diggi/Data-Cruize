import api from "../api";

export const getAllEnvironments = async () => {
    try {
        const response = await api.get('/hyperscaler/environments/getall/');
        console.log(response);
        
        return response.data;
    } catch (err) {
        console.error("Error fetching environments:", err);
        throw err;
    }
};

export const getEnvironmentWithID = async (id: string) => {
    try {
        const response = await api.get(`/hyperscaler/environments/${id}/`);
        return response.data;
    } catch (err) {
        console.error("Error fetching environment with ID:", err);
        throw err;
    }
};

export const createEnvironment = async (data: any) => {
    try {
        const response = await api.post('/hyperscaler/environments/create/', data);
        return response.data;
    } catch (err) {
        console.error("Error creating environment:", err);
        throw err;
    }
};

export const updateEnvironment = async (id: string, data: any) => {
    try {
        const response = await api.patch(`/hyperscaler/environments/${id}/`, data);
        return response.data;
    } catch (err) {
        console.error("Error updating environment:", err);
        throw err;
    }
};

export const deleteEnvironment = async (id: number) => {
    try {
        const response = await api.delete(`/hyperscaler/environments/${id}/`);
        return response.data;
    } catch (err) {
        console.error("Error deleting environment:", err);
        throw err;
    }
};
