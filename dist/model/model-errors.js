"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MODEL_ERRORS = {
    INVALID_MOVE_CONVERSION: {
        http_code: 500,
        message: 'Can not convert to Move'
    },
    INVALID_POSITION_CONVERSION: {
        http_code: 500,
        message: 'Can not convert to Move'
    },
    NO_PIECE_AT_START_POSITION: {
        http_code: 500,
        message: 'MakeMove called with no piece at start position'
    },
    KING_IN_CHECK: {
        http_code: 500,
        message: 'Your King is in check. You need to play the King!'
    }
};
exports.default = MODEL_ERRORS;
