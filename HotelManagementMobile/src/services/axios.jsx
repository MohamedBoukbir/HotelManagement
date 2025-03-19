import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_PC_IP = "192.168.1.128";
const BACKEND_PORT = "8085";

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return `http://${LOCAL_PC_IP}:${BACKEND_PORT}`;
  }
  return `http://${LOCAL_PC_IP}:${BACKEND_PORT}`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 30000
});


api.interceptors.request.use(
  async (config) => {
    try {
     
      if (!config.url.startsWith('/auth')) {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
 
      console.log('Request Details:', {
        fullUrl: `${config.baseURL}${config.url}`,
        method: config.method?.toUpperCase(),
        headers: config.headers,
        data: config.data
      });
      
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('Response Success:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    return Promise.reject(error);
  }
);

export default api;