"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveToString = exports.stringToMove = exports.Move = exports.Position = exports.stringToPosition = exports.positionToString = exports.range = void 0;
const board_1 = require("./board");
const errors_1 = __importDefault(require("../errors/errors"));
const piece_1 = require("./piece");
function range(x, min, max) {
    return x >= min && x <= max;
}
exports.range = range;
function positionToString(position) {
    return `${String.fromCharCode('a'.charCodeAt(0) + position.column)}${board_1.BOARD_HEIGHT - position.row}`;
}
exports.positionToString = positionToString;
function stringToPosition(string) {
    if (string.length != 2)
        throw errors_1.default.INVALID_POSITION_CONVERSION;
    const column = string.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = ('0'.charCodeAt(0) + board_1.BOARD_HEIGHT) - string.charCodeAt(1);
    if (!range(column, 0, board_1.BOARD_WIDTH - 1) || !range(row, 0, board_1.BOARD_HEIGHT - 1))
        throw errors_1.default.INVALID_POSITION_CONVERSION;
    return (0, exports.Position)(column, row);
}
exports.stringToPosition = stringToPosition;
/**
 * Position
 * Build a position object
 * @param {column}
 * @param {row}
 * @returns a new PositionObject with the given {column} and {row}
 */
const Position = (column, row) => {
    return { column, row };
};
exports.Position = Position;
/**
 * Move
 * Build a move object
 * @param {pieceChar}
 * @param {start} position
 * @param {end} position
 * @returns a new move object
*/
const Move = (pieceChar, start, end) => {
    return { pieceChar, start, end };
};
exports.Move = Move;
function stringToMove(string) {
    if (string.length != 5)
        throw errors_1.default.INVALID_MOVE_CONVERSION;
    const piece = string[0];
    const start = stringToPosition(string.substring(1, 3));
    const end = stringToPosition(string.substring(3, 5));
    if (start === null || end === null || (0, piece_1.charToPiece)(piece) === null)
        throw errors_1.default.INVALID_MOVE_CONVERSION;
    return (0, exports.Move)(piece, start, end);
}
exports.stringToMove = stringToMove;
function moveToString(move) {
    return move.pieceChar + positionToString(move.start) + positionToString(move.end);
}
exports.moveToString = moveToString;
