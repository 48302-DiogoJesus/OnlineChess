import ERRORS from '../errors/errors'
import { charToPiece } from './piece';

const BOARD_HEIGHT = 8
const BOARD_WIDTH = 8

export function range(x: number, min: number, max: number) {
    return x >= min && x <= max;
}

/**
 * Position Object
 * Represents a position in a 2D environment such as a matrix
 * @property {column}
 * @property {row}
 */
export interface PositionObject {
    column: number,
    row: number
}

export function positionToString(position: PositionObject): string {
    return `${String.fromCharCode('a'.charCodeAt(0) + position.column)}${BOARD_HEIGHT - position.row}`
}

export function stringToPosition(string: string): PositionObject {
    if (string.length != 2)
        throw ERRORS.INVALID_POSITION_CONVERSION

    const column = string.charCodeAt(0) - 'a'.charCodeAt(0)
    const row = ('0'.charCodeAt(0) + BOARD_HEIGHT) - string.charCodeAt(1)

    if (!range(column, 0, BOARD_WIDTH - 1) || !range(row, 0, BOARD_HEIGHT - 1))
        throw ERRORS.INVALID_POSITION_CONVERSION

    return Position(column, row)
}

/**
 * Position
 * Build a position object
 * @param {column}
 * @param {row}
 * @returns a new PositionObject with the given {column} and {row}
 */
export const Position = (column: number, row: number): PositionObject => {
    return { column, row }
}

export interface MoveObject {
    pieceChar: string,
    start: PositionObject,
    end: PositionObject
}

/**
 * Move
 * Build a move object
 * @param {pieceChar}
 * @param {start} position
 * @param {end} position
 * @returns a new move object
*/
export const Move = (pieceChar: string, start: PositionObject, end: PositionObject): MoveObject => {
    return { pieceChar, start, end }
}

export function stringToMove(string: string) {
    if (string.length != 5)
        throw ERRORS.INVALID_MOVE_CONVERSION

    const piece = string[0]
    const start = stringToPosition(string.substring(1, 3))
    const end = stringToPosition(string.substring(3, 5))

    if (start === null || end === null || charToPiece(piece) === null)
        throw ERRORS.INVALID_MOVE_CONVERSION

    return Move(piece, start, end)
}

export function moveToString(move: MoveObject): string {
    return move.pieceChar + positionToString(move.start) + positionToString(move.end)
}