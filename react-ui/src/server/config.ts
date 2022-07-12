import axios from 'axios'

const BACKEND_API_URL = '/api/'

const axiosI = axios.create({
    baseURL: BACKEND_API_URL,
    /*
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }, 
    */
    validateStatus: () => true,
})

const config = {
    SERVER_URL: BACKEND_API_URL,
    AXIOSINSTANCE: axiosI
}

export default config;