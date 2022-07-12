import { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from 'axios'
import CONFIG from './config'

import Alerts from '../utils/Alerts/sa-alerts'
import State from '../state/State'
import { PieceColor } from '../domain/piece'

const AXIOSI = CONFIG.AXIOSINSTANCE

function getHeaders(): AxiosRequestHeaders {
    const token = State.getAppState().authentication.token
    if (token != null)
        return { 'Authorization': 'Bearer ' + State.getAppState().authentication.token }
    else
        return {}
}

// Private
export interface ServerError {
    http_code: number,
    message: string
}

export interface ServerResponse {
    success: boolean,
    data: any | ServerError
}

export interface RemoteGame {
    _id: string,
    player_w: string,   // username of player1
    player_b: string | null,  // username of player2

    moves: string[],
    winner: PieceColor | null,
    views: number
}


function responseIntercept(response: AxiosResponse, showPopupOnError: boolean = true): ServerResponse {
    if (response.status < 200 || response.status >= 400) {
        // If not authorized logout to avoid visual bugs
        if (response.status == 401) {
            State.logout()
        }
        const responseAsError = response.data.error as ServerError
        if (showPopupOnError)
            Alerts.showNotification(responseAsError.message)
        return { success: false, data: responseAsError }
    }
    return { success: true, data: response.data.data }
}

function handleRequestError(err: any): ServerResponse {
    return {
        success: false,
        data: {
            http_code: 503,
            message: err.message == "Network Error"
                ? "Server is Offline"
                : err.message,
        }
    }
}

// PUBLIC FUNCTIONS
const logout = (): Promise<ServerResponse> =>
    AXIOSI.get('/auth/logout', {
        headers: getHeaders()
    })
        .then((res: AxiosResponse) => responseIntercept(res, false))
        .catch(err => handleRequestError(err))


const getGame = (game_id: string): Promise<ServerResponse> =>
    AXIOSI.get(`/games?id=${game_id}`, {
        headers: getHeaders()
    })
        .then((res: AxiosResponse) => responseIntercept(res, false))
        .catch(err => handleRequestError(err))


const tryLogin = (username: string, password: string): Promise<ServerResponse> =>
    AXIOSI.post('/auth', {
        username: username,
        password: password
    }, { headers: getHeaders() })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))


const trySignup = (username: string, password: string): Promise<ServerResponse> =>
    AXIOSI.post('/users', {
        username: username,
        password: password
    }, { headers: getHeaders() })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))


const createGame = (game_id: string, is_public: boolean = true, opponent: string | null = null): Promise<ServerResponse> =>
    AXIOSI.post(`/games`, {
        id: game_id,
        public: is_public,
        player2: opponent,
    }, { headers: getHeaders() })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))


const joinAsPlayerB = (game_id: string): Promise<ServerResponse> =>
    AXIOSI.get(`/games/connect?id=${game_id}`, {
        headers: getHeaders(),
    })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))

const makeMove = (game_id: string, move: string): Promise<ServerResponse> =>
    AXIOSI.get(`/games/makemove?id=${game_id}&move=${move}`, {
        headers: getHeaders(),
    })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))

const incrementViewers = (game_id: string) =>
    AXIOSI.post('/games/incrementviewers', {
        id: game_id
    }, { headers: getHeaders() })
        .then((res: AxiosResponse) => responseIntercept(res))
        .catch(err => handleRequestError(err))

const Server = {
    // Game
    createGame,
    getGame,
    joinAsPlayerB,
    makeMove,
    incrementViewers,

    // Authentication
    logout,
    tryLogin,
    trySignup
}

export default Server