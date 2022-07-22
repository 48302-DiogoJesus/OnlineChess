import axios from 'axios'

const axiosI = axios.create({
    baseURL: '/api/',
    /*
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }, 
    */
    validateStatus: () => true,
})

const config = {
    AXIOSINSTANCE: axiosI
}

export default config;