import axios from "axios";
import axiosRetry from "axios-retry";


const BASE_API_URL = "https://tbdr.dev/api/";


const http = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: false
})

const https = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: false,
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
})

https.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
https.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
https.defaults.headers.common["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";


https.interceptors.request.use(config => {
    return config;
}, err => {
    return Promise.reject(err.response.data)
})

https.interceptors.response.use(response => {


    return response
}, err => {

    return Promise.reject(err.response.data)
})

axiosRetry(https, {
    retries: 3
})

export const useHttps = () => {
    return https;
}

export const useHttp = () => {
    return http;
}