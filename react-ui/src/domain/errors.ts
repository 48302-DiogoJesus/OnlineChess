export interface BoardError {
    code: number,
    message: string
}

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
}

// ALL ERRORS
const errors = {
    ...BOARD_ERRORS
}

export default errors;