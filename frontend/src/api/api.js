import axios from 'axios';
import { BACKEND_API_URL } from '../config';
import { getUserToken } from '../lib/helper';



const axiosInstance = axios.create({
    baseURL: BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }

});
// intereceptor to add token to headers on every request if user is logged in
// TODO: add refresh token logic if token is expired
// TODO: add logout logic if refresh token is expired
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getUserToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)
export default axiosInstance;