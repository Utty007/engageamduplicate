// import axios, {
//   AxiosError,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from 'axios';
// import { getLocalStorageItem } from '../utils/localStorage';
import axios from "axios";

// Types for API responses
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

// Error response type
// interface ApiError {
//   message: string;
//   status: number;
//   errors?: Record<string, string[]>;
// }

// Create axios instance
const api = axios.create({
  baseURL: 'https://engageam.app/dashboard_php',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Get token from localStorage or wherever you store it
//     const token = getLocalStorageItem('token');

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   },
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: AxiosError<ApiError>) => {
//     const { response } = error;

//     // Handle unauthorized errors (401)
//     if (response?.status === 401) {
//       // Clear localStorage
//       localStorage.clear();
//       // Redirect to login page
//       window.location.href = '/login';
//     }

//     // Handle other errors
//     const errorMessage =
//       response?.data?.message || 'An unexpected error occurred';

//     return Promise.reject({
//       message: errorMessage,
//       status: response?.status,
//       errors: response?.data?.errors,
//     });
//   },
// );

// Utility function to make typed requests
export const apiClient = {
  get: <T>(url: string) =>
    api.get<ApiResponse<T>>(url).then((response) => response.data),

  // Special GET with body
  getWithBody: <T>(url: string, data: unknown) =>
    api
      .request<ApiResponse<T>>({
        method: 'GET',
        url: url,
        data: data,
      })
      .then((response) => response.data),

  post: <T>(url: string, data: unknown) =>
    api.post<ApiResponse<T>>(url, data).then((response) => response.data),

  put: <T>(url: string, data: unknown) =>
    api.put<ApiResponse<T>>(url, data).then((response) => response.data),

  delete: <T>(url: string) =>
    api.delete<ApiResponse<T>>(url).then((response) => response.data),
};

export default api;
