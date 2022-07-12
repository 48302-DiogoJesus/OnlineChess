import axios from 'axios'

const PROD = true

const PROD_BACKEND_API_URL = 'https://chess-backend-api.herokuapp.com/api/'

const BACKEND_API_URL = PROD ? PROD_BACKEND_API_URL : `http://localhost:7000/api/`

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