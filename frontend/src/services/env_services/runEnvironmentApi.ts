import api from "../api";

export const runEnvironment = async (data: { env: number; cloud: number; git: number }) => {
    try {
        const response = await api.post('/hyperscaler/environments/run/', data);
        console.log(response.data);
        return response.data;  // This will be the `result` dict returned by DRF
    } catch (err) {
        console.error("Error running environment:", err);
        throw err;
    }
};
