import api from "./api";

const operationsService = {

    async getDashboard() {

        const response = await api.get(
            "/operations-dashboard"
        );

        return response.data;
    },

};

export default operationsService;