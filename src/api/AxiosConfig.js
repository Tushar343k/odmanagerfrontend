import axios from "axios";

const api = axios.create({
    baseURL: "https://odmanagerbackend-3.onrender.com",
});

export default api;

