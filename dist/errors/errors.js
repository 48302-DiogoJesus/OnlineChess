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
    }
};
// ALL ERRORS
const errors = Object.assign(Object.assign(Object.assign({}, GAME_ERRORS), API_ERRORS), USER_ERRORS);
exports.default = errors;
