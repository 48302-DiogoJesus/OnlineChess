export interface ErrorObject {
    code: number,
    message: string
}

const GAME_ERRORS = {
    GAME_ALREADY_EXISTS: {
        http_code: 409,
        message: "Game with that ID already exists"
    },
    GAME_DOES_NOT_EXIST: {
        http_code: 404,
        message: "Game with that ID does not exist"
    }
}

const API_ERRORS = {
    BAD_REQUEST: (message: string) => {
        return {
            http_code: 400,
            message: message
        }
    }
}

// ALL ERRORS
const errors = {
    ...GAME_ERRORS,
    ...API_ERRORS
}

export default errors;