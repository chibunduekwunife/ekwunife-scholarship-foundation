// interceptor to manually add the correct headers

import axios from 'axios'
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // This should be http://127.0.0.1:8000
  // ...other config
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api