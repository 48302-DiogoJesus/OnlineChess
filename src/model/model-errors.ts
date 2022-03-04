export interface ErrorObject {
    http_code: number,
    message: string
}

const MODEL_ERRORS = {
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
    }
}

export default MODEL_ERRORS