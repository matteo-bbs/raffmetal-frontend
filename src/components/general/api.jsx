import axios from "axios";
import { BASE_URL } from './baseUrl.jsx';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
});

export default axiosInstance;