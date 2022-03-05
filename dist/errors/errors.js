"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GAME_ERRORS = {
    GAME_ALREADY_EXISTS: {
        http_code: 409,
        message: "Game with that ID already exists"
    },
    GAME_DOES_NOT_EXIST: {
        http_code: 404,
        message: "Game with that ID does not exist"
    },
    INVALID_GAMEID_LENGTH: {
        http_code: 400,
        message: "The GameID should have between 5 and 20 characters"
    },
    INVALID_GAMEID_CHARACTERS: {
        http_code: 400,
        message: "The GameID should contain alphanumeric characters, '_'(underline) and '-'(dash)"
    },
    NOT_AUTHORIZED_TO_CONNECT: {
        http_code: 403,
        message: 'You are not allowed to connect to this game'
    }
};
const API_ERRORS = {
    BAD_REQUEST: (message) => {
        return {
            http_code: 400,
            message: message
        };
    }
};
const USER_ERRORS = {
    INVALID_USERNAME_LENGTH: {
        http_code: 400,
        message: 'Username should have between 5 and 25 characters'
    },
    INVALID_USERNAME_CHARACTERS: {
        http_code: 400,
        message: "The Username should contain alphanumeric characters"
    },
    USER_DOES_NOT_EXIST: {
        http_code: 400,
        message: "User does not exist"
    },
    USER_ALREADY_EXISTS: {
        http_code: 409,
        message: "User already exists"
    },
    INVALID_PASSWORD_LENGTH: {
        http_code: 400,
        message: 'Password should have between 5 and 25 characters'
    },
    INVALID_PASSWORD_CHARACTERS: {
        http_code: 400,
        message: "The Password should contain alphanumeric characters"
    },
    INVALID_PASSWORD_UPPERCASE: {
        http_code: 400,
        message: "The Password should contain at least 1 uppercase character"
    },
    WRONG_PASSWORD: {
        http_code: 400,
        message: "Wrong password for that username"
    },
    INVALID_TOKEN: {
        http_code: 401,
        message: "You need to be authenticated to perform that operation"
    },
    NOT_AUTHORIZED: {
        http_code: 403,
        message: "Forbidden Action"
    }
};
const BOARD_ERRORS = {
    INVALID_MOVE_CONVERSION: {
        http_code: 500,
        message: 'Can not convert to Move'
    },
    INVALID_POSITION_CONVERSION: {
        http_code: 500,
        message: 'Can not convert to Position'
    },
    NO_PIECE_AT_START_POSITION: {
        http_code: 500,
        message: 'MakeMove called with no piece at start position'
    },
    KING_IN_CHECK: {
        http_code: 500,
        message: 'Your King is in check. You need to play the King!'
    },
    INVALID_MOVE: {
        http_code: 500,
        message: 'Invalid Piece Move'
    },
    ALREADY_OVER: {
        http_code: 500,
        message: 'This game is already over'
    },
    BAD_BOARD_STRING: {
        http_code: 500,
        message: "Invalid string. Can't convert to board"
    },
    NOT_YOUR_TURN: {
        http_code: 403,
        message: "It's not your turn!"
    }
};
// ALL ERRORS
const errors = Object.assign(Object.assign(Object.assign(Object.assign({ UNKNOWN_ERROR: (code = 500, message = "Unknown error") => {
        return {
            http_code: code,
            message: message
        };
    } }, GAME_ERRORS), API_ERRORS), USER_ERRORS), BOARD_ERRORS);
exports.default = errors;
