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
// ALL ERRORS
const errors = Object.assign(Object.assign({}, GAME_ERRORS), API_ERRORS);
exports.default = errors;
